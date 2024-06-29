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
    const results = await sql`
      select w.id, w.name, w."createdAt", w."isPrivate", array_agg(u.email) as members
      from workspace w
      left join workspace_member wm on w.id = wm.wid
      left join "user" u on wm.uid = u.id
      where ${
        email
          ? sql`exists 
          (select 1 
           from workspace_member 
           where wid = w.id and uid = (select id from "user" where email = ${email}))`
          : sql`w."isPrivate" = false`
      }
      group by w.id, w."createdAt"
      order by w."createdAt" desc
    `;
    return results.map(r => ({
      id: r.id,
      name: r.name,
      createdAt: r.createdAt,
      isPrivate: r.isPrivate,
      members: r.members,
    }));
  }

  async getWorkspace(id: string): Promise<Workspace> {
    const results = await sql`
      select w.id, w.name, w."createdAt", w."isPrivate", array_agg(u.email) as members
      from workspace w
      left join workspace_member wm on w.id = wm.wid
      left join "user" u on wm.uid = u.id
      where w.id = ${id}
      group by w.id
    `;

    if (isEmpty(results)) throw new NotFoundError(`Workspace not found`);

    const workspaceMeta: WorkspaceMeta = {
      id: results[0].id,
      name: results[0].name,
      createdAt: results[0].createdAt,
      isPrivate: results[0].isPrivate,
      members: results[0].members,
    };

    const resources: Resource[] = await this.getResources(id);
    return {
      ...workspaceMeta,
      resources,
    };
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

  async addWorkspaceMember(wid: string, userId: string): Promise<string[]> {
    await sql`
      insert into workspace_member (wid, uid)
      values (${wid}, ${userId})
      on conflict do nothing
    `;
    return this.getWorkspaceMembers(wid);
  }

  async removeWorkspaceMember(wid: string, userId: string): Promise<string[]> {
    await sql`
      delete from workspace_member
      where wid = ${wid} and uid = ${userId}
    `;
    return this.getWorkspaceMembers(wid);
  }

  async searchWorkspaces(searchParams: SearchParams, email?: string): Promise<WorkspaceMeta[]> {
    const { query, skip, limit } = searchParams;
    return sql`
        select w.*
        from workspace w
           left join workspace_member wm on w.id = wm.wid
           left join "user" u on wm.uid = u.id
        where (w."isPrivate" = false or ${email ? sql`u.email = ${email}` : sql`true`})
           and w.name ilike ${'%' + query + '%'}
        group by w.id, w."createdAt"
        order by w."createdAt" desc
        offset ${skip} limit ${limit}
    `;
  }

  private async getWorkspaceMembers(wid: string): Promise<string[]> {
    const result = await sql`
      select array_agg(u.email) as members
      from workspace_member wm
      join "user" u on wm.uid = u.id
      where wm.wid = ${wid}
    `;
    return result[0].members;
  }
}
