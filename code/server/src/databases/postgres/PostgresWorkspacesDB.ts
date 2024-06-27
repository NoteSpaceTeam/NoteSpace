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
        insert into workspace (name, "isPrivate") 
        values (${name}, ${isPrivate}) 
        returning id
    `;
    if (isEmpty(results)) throw new Error('Workspace not created');
    return results[0].id;
  }

  async getWorkspaces(email?: string): Promise<WorkspaceMeta[]> {
    const condition = email ? sql`${email} = any(members)` : sql`"isPrivate" = false`;
    const results = await sql`
      select row_to_json(t) as workspace
      from (
        select *, count(members) as members
        from workspace
        where ${condition}
        group by id
        order by "createdAt" desc
      ) as t
    `;
    return results.map(r => r.workspace);
  }

  async getWorkspace(id: string): Promise<Workspace> {
    const results: Workspace[] = await sql`
        select *
        from workspace
        where id = ${id}
    `;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found`);
    return results[0];
  }

  async getResources(wid: string): Promise<Resource[]> {
    return (
      await sql`
          select row_to_json(t) as resources
          from (
            select *
            from resource
            where workspace = ${wid}
            group by id
            order by "updatedAt" desc
          ) as t
      `
    ).map(r => r.resources);
  }

  async updateWorkspace(id: string, newProps: Partial<WorkspaceMeta>): Promise<void> {
    const results = await sql`
        update workspace
        set ${sql(newProps)}
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

  async addWorkspaceMember(wid: string, email: string): Promise<void> {
    const results = await sql`
      update workspace
      set members = array_append(members, ${email}::text)
      where id = ${wid} and not ${email} = any(members)
      returning id
    `;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found or member already in workspace`);
  }

  async removeWorkspaceMember(wid: string, email: string): Promise<void> {
    const results = await sql`
      update workspace
      set members = array_remove(members, ${email}::text)
      where id = ${wid}
      returning id
    `;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found or member does not exist`);
  }

  async searchWorkspaces(searchParams: SearchParams): Promise<WorkspaceMeta[]> {
    const { query, skip, limit } = searchParams;
    return sql`
        select *, array_length(members, 1) as members
        from workspace
        where "isPrivate" = false and name ilike ${'%' + query + '%'}
        order by "createdAt" desc
        offset ${skip} limit ${limit}
    `;
  }
}
