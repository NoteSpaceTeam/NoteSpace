import { WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { Workspace, WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { DocumentsRepository, WorkspacesRepository } from '@databases/types';

export class WorkspacesService {
  private readonly workspaces: WorkspacesRepository;
  private readonly documents: DocumentsRepository;

  constructor(workspaces: WorkspacesRepository, documents: DocumentsRepository) {
    this.workspaces = workspaces;
    this.documents = documents;
  }

  async createWorkspace(name: string): Promise<string> {
    const id = await this.workspaces.createWorkspace(name);
    this.documents.addWorkspace(id);
    return id;
  }

  async getWorkspaces(): Promise<WorkspaceMetaData[]> {
    return await this.workspaces.getWorkspaces();
  }

  async getWorkspace(id: string, metaOnly: boolean): Promise<Workspace | WorkspaceMetaData> {
    const metadata = await this.workspaces.getWorkspace(id);
    if (metaOnly) return metadata;
    const resources = await this.getWorkspaceResources(id);
    return { ...metadata, resources };
  }

  async updateWorkspace(id: string, name: string) {
    await this.workspaces.updateWorkspace(id, name);
  }

  async deleteWorkspace(id: string) {
    await this.workspaces.deleteWorkspace(id);
    await this.documents.removeWorkspace(id);
  }

  private async getWorkspaceResources(id: string): Promise<Record<string, WorkspaceResource>> {
    return await this.workspaces.getWorkspaceResources(id);
  }
}
