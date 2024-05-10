import { WorkspaceResource } from '../../../../../shared/workspace/resource';
import { WorkspaceInfo } from '@notespace/shared/workspace/workspace';
import sql from './sql';
import { NotFoundError } from '@domain/errors/errors';


export class WorkspaceDB  {

  async createWorkspace(name: string) : Promise<string> {
    const results = await sql`
        INSERT INTO workspace (name) 
        VALUES (${name}) 
        RETURNING id
    `;
    return results[0].id;
  }

  async getWorkspace(workspace: string) : Promise<WorkspaceInfo> {
    const results : WorkspaceInfo[]  =  await sql`SELECT * FROM workspace WHERE id = ${workspace}`;

    if (results.length === 0) throw new NotFoundError(`Workspace with id ${workspace} not found`);
    if (results.length > 1) throw new Error(`Multiple workspaces with id ${workspace} found`);
    return results[0];
  }

  async updateWorkspace(id: string, name: string) : Promise<void> {
    const results = await sql`
        UPDATE workspace 
        SET name = ${name} 
        WHERE id = ${id}
    `;
    if (results.length === 0) throw new NotFoundError(`Workspace with id ${id} not found`);
  }

  async deleteWorkspace(id: string) : Promise<void> {
    const results = await sql`DELETE FROM workspace WHERE id = ${id}`;
    if (results.length === 0) throw new NotFoundError(`Workspace with id ${id} not found`);
  }

  async getWorkspaceResources(workspace: string) : Promise<WorkspaceResource[]> {
    return sql`SELECT * FROM resource WHERE workspace = ${workspace}`;
  }
}