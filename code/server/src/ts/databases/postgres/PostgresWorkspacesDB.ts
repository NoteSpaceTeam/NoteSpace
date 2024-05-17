import { WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { NotFoundError } from '@domain/errors/errors';
import { WorkspacesRepository } from '@databases/types';
import { isEmpty } from 'lodash';
import sql from '@databases/postgres/config';

export class PostgresWorkspacesDB implements WorkspacesRepository {
  async createWorkspace(name: string): Promise<string> {
    const results = await sql`
        INSERT INTO workspaces (name) 
        VALUES (${name}) 
        RETURNING id
    `;
    if (isEmpty(results)) throw new Error('Workspace not created');
    return results[0].id;
  }

  async getWorkspaces(): Promise<WorkspaceMetaData[]> {
    return sql`SELECT * FROM workspaces`;
  }

  async getWorkspace(id: string): Promise<WorkspaceMetaData> {
    const results: WorkspaceMetaData[] = await sql`SELECT * FROM workspaces WHERE id = ${id}`;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found`);
    return results[0];
  }

  async updateWorkspace(id: string, name: string): Promise<void> {
    const results = await sql`
        UPDATE workspaces
        SET name = ${name} 
        WHERE id = ${id}
        RETURNING id
    `;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found`);
  }

  async deleteWorkspace(id: string): Promise<void> {
    const results = await sql`
        DELETE FROM workspaces WHERE id = ${id}
        RETURNING id
    `;
    if (isEmpty(results)) throw new NotFoundError(`Workspace not found`);
  }

  async getWorkspaceResources(wid: string): Promise<Record<string, WorkspaceResource>> {
    const results: WorkspaceResource[] = await sql`
        SELECT json_object_agg(id, r) 
        FROM resources r
        WHERE workspace = ${wid}
    `;
    const entries = results.map(entry => [entry.id, entry]);

    return Object.fromEntries(entries);
  }
}
