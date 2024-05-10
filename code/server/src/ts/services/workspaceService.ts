import { WorkspaceResource } from '../../../../shared/workspace/resource';
import { Workspace } from '@notespace/shared/workspace/workspace';
import { WorkspaceDB } from '@database/pg/workspaceDB';

export class WorkspaceService {
  private readonly database: WorkspaceDB;

  constructor(database: WorkspaceDB) {
    this.database = database;
  }

  async createWorkspace(title: string): Promise<string> {
    return await this.database.createWorkspace(title);
  }

  async getWorkspace(id: string): Promise<Workspace> {
    const metadata = await this.database.getWorkspace(id);
    const resources = await this.getWorkspaceResources(id);
    return { ...metadata, resources };
  }

  async updateWorkspace(id: string, name: string) {
    await this.database.updateWorkspace(id, name);
  }

  async deleteWorkspace(id: string) {
    await this.database.deleteWorkspace(id);
  }

  private async getWorkspaceResources(workspace: string): Promise<WorkspaceResource[]> {
    return await this.database.getWorkspaceResources(workspace);
  }
}
