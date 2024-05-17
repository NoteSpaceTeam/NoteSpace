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
    await this.documents.addWorkspace(id);
    return id;
  }

  async updateWorkspace(id: string, name: string) {
    await this.workspaces.updateWorkspace(id, name);
  }

  async deleteWorkspace(id: string) {
    await this.workspaces.deleteWorkspace(id);
    await this.documents.removeWorkspace(id);
  }

  async getWorkspaces(): Promise<WorkspaceMetaData[]> {
    return await this.workspaces.getWorkspaces();
  }

  async getWorkspace(id: string, metaOnly: boolean = false): Promise<Workspace> {
    const metadata = await this.workspaces.getWorkspace(id);
    if (metaOnly) return { ...metadata, resources: [] };
    const resources = await this.getWorkspaceResources(id);
    return { ...metadata, resources };
  }

  private async getWorkspaceResources(id: string): Promise<WorkspaceResource[]> {
    return await this.workspaces.getWorkspaceResources(id);
  }
}
