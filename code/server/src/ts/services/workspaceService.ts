import { WorkspaceResource } from '../../../../shared/workspace/resource';
import { WorkspaceInfo } from '@notespace/shared/workspace/workspace';
import { WorkspaceDB } from '@database/pg/workspaceDB';

export class WorkspaceService {

  private readonly database : WorkspaceDB;

  constructor(database: WorkspaceDB) {
    this.database = database;
  }

  async createWorkspace (title: string) : Promise<string> {
    return await this.database.createWorkspace(title);
  }

  async getWorkspace(id: string) : Promise<WorkspaceInfo> {
    return await this.database.getWorkspace(id);
  }

  async updateWorkspace(id: string, name: string) {
    await this.database.updateWorkspace(id, name);
  }

  async deleteWorkspace(id: string) {
    await this.database.deleteWorkspace(id);
  }

  async getWorkspaceResources(workspace: string) : Promise<WorkspaceResource[]> {
    return await this.database.getWorkspaceResources(workspace);
  }
}