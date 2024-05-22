import { WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { WorkspaceMetaData, WorkspaceResources } from '@notespace/shared/src/workspace/types/workspace';
import { NotFoundError } from '@domain/errors/errors';
import { WorkspacesRepository } from '@databases/types';
import { isEmpty } from 'lodash';
import sql from '@databases/postgres/config';

export class PostgresWorkspacesDB implements WorkspacesRepository {
  async createWorkspace(name: string): Promise<string> {
    const results = await sql`
        insert into workspace (name) 
        values (${name}) 
        returning id
    `;
    if (isEmpty(results)) throw new Error('Workspace not created');
    return results[0].id;
  }

  async getWorkspaces(): Promise<WorkspaceMetaData[]> {
    return sql`select * from workspace`;
  }

  async getWorkspace(id: string): Promise<WorkspaceMetaData> {
    const results: WorkspaceMetaData[] = await sql`select * from workspace where id = ${id}`;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found`);
    return results[0];
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

  async getWorkspaceResources(id: string): Promise<WorkspaceResources> {
    const results: WorkspaceResource[] = (
      await sql`
      select row_to_json(t) as resources
      from(
            select id, name, type, parent, children
            from resource
            where workspace = ${id}
            group by id
            order by created_at desc
          ) as t
    `
    ).map(r => r.resources);

    return Object.fromEntries(results.map(r => [r.id, r]));
  }
}
