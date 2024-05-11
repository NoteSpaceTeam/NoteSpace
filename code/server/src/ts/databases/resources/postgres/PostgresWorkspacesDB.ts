import { WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { NotFoundError } from '@domain/errors/errors';
import sql from '@databases/resources/postgres/config';
import { WorkspacesRepository } from '@databases/types';
import { isEmpty } from 'lodash';

export class PostgresWorkspacesDB implements WorkspacesRepository {
  async createWorkspace(name: string): Promise<string> {
    const results = await sql`
        INSERT INTO workspace (name) 
        VALUES (${name}) 
        RETURNING id
    `;
    if (isEmpty(results)) throw new Error('Workspace not created');
    return results[0].id;
  }

  async getWorkspaces(): Promise<WorkspaceMetaData[]> {
    return sql`SELECT * FROM workspace`;
  }

  async getWorkspace(id: string): Promise<WorkspaceMetaData> {
    const results: WorkspaceMetaData[] = await sql`SELECT * FROM workspace WHERE id = ${id}`;
    if (isEmpty(results)) throw new NotFoundError(`Workspace with id ${id} not found`);
    return results[0];
  }

  async updateWorkspace(id: string, name: string): Promise<void> {
    const results = await sql`
        UPDATE workspace 
        SET name = ${name} 
        WHERE id = ${id}
    `;
    if (isEmpty(results)) throw new NotFoundError(`Workspace with id ${id} not found`);
  }

  async deleteWorkspace(id: string): Promise<void> {
    const results = await sql`DELETE FROM workspace WHERE id = ${id}`;
    if (isEmpty(results)) throw new NotFoundError(`Workspace with id ${id} not found`);
  }

  async getWorkspaceResources(id: string): Promise<WorkspaceResource[]> {
    return sql`SELECT * FROM resource WHERE workspace = ${id}`;
  }
}
