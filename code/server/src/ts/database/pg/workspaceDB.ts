import { WorkspaceResource } from '@notespace/shared/workspace/types/resource';
import { WorkspaceInfo } from '@notespace/shared/workspace/types/workspace';
import sql from './database';
import { NotFoundError } from '@domain/errors/errors';


export class WorkspaceDB  {

  async createWorkspace(title: string) : Promise<string> {
    const results = await sql`INSERT INTO workspace (title) VALUES (${title}) RETURNING id`;
    return results[0].id;
  }

  async getWorkspace(workspace: string) : Promise<WorkspaceInfo> {
    const results : WorkspaceInfo[]  =  await sql`SELECT * FROM workspace WHERE id = ${workspace}`;

    if (results.length === 0) {
      throw new NotFoundError(`Workspace with id ${workspace} not found`);
    }
    if (results.length > 1) {
      throw new Error(`Multiple workspaces with id ${workspace} found`);
    }
    return results[0];
  }

  async updateWorkspace(id: string, name: string) : Promise<void> {

  }

  async deleteWorkspace(id: string) : Promise<void> {

  }

  async getWorkspaceResources(workspace: string) : Promise<WorkspaceResource[]> {
    return sql`SELECT * FROM resource WHERE workspace = ${workspace}`;
  }
}