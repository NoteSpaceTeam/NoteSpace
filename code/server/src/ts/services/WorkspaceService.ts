import { WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { Workspace, WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { WorkspaceRepository } from '@database/types';

export class WorkspaceService {
  private readonly database: WorkspaceRepository;

  constructor(database: WorkspaceRepository) {
    this.database = database;
  }

  async createWorkspace(title: string): Promise<string> {
    return await this.database.createWorkspace(title);
  }

  async getWorkspaces(): Promise<WorkspaceMetaData[]> {
    return await this.database.getWorkspaces();
  }

  async getWorkspace(id: string, metaOnly: boolean): Promise<Workspace | WorkspaceMetaData> {
    const metadata = await this.database.getWorkspace(id);
    if (metaOnly) return metadata;
    const resources = await this.getWorkspaceResources(id);
    return { ...metadata, resources };
  }

  async updateWorkspace(id: string, name: string) {
    await this.database.updateWorkspace(id, name);
  }

  async deleteWorkspace(id: string) {
    await this.database.deleteWorkspace(id);
  }

  private async getWorkspaceResources(id: string): Promise<WorkspaceResource[]> {
    return await this.database.getWorkspaceResources(id);
  }
}
