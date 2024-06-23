import { Workspace, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { NotFoundError } from '@domain/errors/errors';
import { WorkspacesRepository } from '@databases/types';
import { isEmpty } from 'lodash';
import sql from '@databases/postgres/config';
import { Resource } from '@notespace/shared/src/workspace/types/resource';
import { SearchParams } from '@src/utils/searchParams';

export class PostgresWorkspacesDB implements WorkspacesRepository {
  async createWorkspace(name: string, isPrivate: boolean): Promise<string> {
    const results = await sql`
        insert into workspace (name, private) 
        values (${name}, ${isPrivate}) 
        returning id
    `;
    if (isEmpty(results)) throw new Error('Workspace not created');
    return results[0].id;
  }

  async getWorkspaces(userId: string): Promise<WorkspaceMeta[]> {
    return (
      await sql`
          select row_to_json(t) as workspace
          from (
            select id, name, private, count(members) as members
            from workspace
            where private = false or ${userId} = any(members)
            group by id
            order by created_at desc
          ) as t
      `
    ).map(r => r.workspace);
  }

  async getWorkspace(id: string): Promise<Workspace> {
    // TODO: convert member user ids to emails
    const results: Workspace[] = await sql`select * from workspace where id = ${id}`;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found`);
    return results[0];
  }

  async getResources(wid: string): Promise<Resource[]> {
    return (
      await sql`
          select row_to_json(t) as resources
          from (
            select id, name, type, parent, children
            from resource
            where workspace = ${wid}
            group by id
            order by created_at desc
          ) as t
      `
    ).map(r => r.resources);
  }

  async updateWorkspace(id: string, name: string): Promise<void> {
    const results = await sql`
        update workspace
        set name = ${name} 
        where id = ${id}
        returning id
    `;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found`);
  }

  async deleteWorkspace(id: string): Promise<void> {
    const results = await sql`
        delete from workspace where id = ${id}
        returning id
    `;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found`);
  }

  async addWorkspaceMember(wid: string, userId: string): Promise<void> {
    const results = await sql`
      update workspace
      set members = array_append(members, ${userId}::char(16))
      where id = ${wid} and not ${userId} = any(members)
      returning id
    `;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found or member already in workspace`);
  }

  async removeWorkspaceMember(wid: string, userId: string): Promise<void> {
    const results = await sql`
      update workspace
      set members = array_remove(members, ${userId}::char(16))
      where id = ${wid}
      returning id
    `;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found or member does not exist`);
  }

  async searchWorkspaces(searchParams: SearchParams): Promise<WorkspaceMeta[]> {
    const { query, skip, limit } = searchParams;
    return sql`
        select id, name, created_at, array_length(members, 1), private
        from workspace
        where private = false and name ilike ${'%' + query + '%'}
        order by created_at desc
        offset ${skip} limit ${limit}
    `;
  }
}
