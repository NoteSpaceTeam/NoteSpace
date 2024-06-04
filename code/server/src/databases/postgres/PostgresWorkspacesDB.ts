import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { NotFoundError } from '@domain/errors/errors';
import { WorkspacesRepository } from '@databases/types';
import { isEmpty } from 'lodash';
import sql from '@databases/postgres/config';
import { Resource } from '@notespace/shared/src/workspace/types/resource';

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

  async getWorkspaces(): Promise<WorkspaceMeta[]> {
    return sql`select * from workspace`;
  }

  async getWorkspace(id: string): Promise<WorkspaceMeta> {
    const results: WorkspaceMeta[] = await sql`select *from workspace where id = ${id}`;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found`);
    return results[0];
  }

  async getResources(wid: string): Promise<Resource[]> {
    return (
      await sql`
          select row_to_json(t) as resources
          from(
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
}
