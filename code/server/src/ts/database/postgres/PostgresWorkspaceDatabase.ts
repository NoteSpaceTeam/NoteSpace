import { WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { NotFoundError } from '@domain/errors/errors';
import sql from '@database/postgres/config';
import { WorkspaceRepository } from '@database/types';

export class PostgresWorkspaceDatabase implements WorkspaceRepository {
  async createWorkspace(name: string): Promise<string> {
    const results = await sql`
        INSERT INTO workspace (name) 
        VALUES (${name}) 
        RETURNING id
    `;
    if (results.length === 0) throw new Error('Workspace not created');
    return results[0].id;
  }

  async getWorkspaces(): Promise<WorkspaceMetaData[]> {
    return sql`SELECT * FROM workspace`;
  }

  async getWorkspace(id: string): Promise<WorkspaceMetaData> {
    const results: WorkspaceMetaData[] = await sql`SELECT * FROM workspace WHERE id = ${id}`;
    if (results.length === 0) throw new NotFoundError(`Workspace with id ${id} not found`);
    return results[0];
  }

  async updateWorkspace(id: string, name: string): Promise<void> {
    const results = await sql`
        UPDATE workspace 
        SET name = ${name} 
        WHERE id = ${id}
    `;
    if (results.length === 0) throw new NotFoundError(`Workspace with id ${id} not found`);
  }

  async deleteWorkspace(id: string): Promise<void> {
    const results = await sql`DELETE FROM workspace WHERE id = ${id}`;
    if (results.length === 0) throw new NotFoundError(`Workspace with id ${id} not found`);
  }

  async getWorkspaceResources(id: string): Promise<WorkspaceResource[]> {
    return sql`SELECT * FROM resource WHERE workspace = ${id}`;
  }
}
