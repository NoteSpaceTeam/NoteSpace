import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { DocumentsRepository, WorkspacesRepository } from '@databases/types';

export class WorkspacesService {
  private readonly workspaces: WorkspacesRepository;
  private readonly documents: DocumentsRepository;

  constructor(workspaces: WorkspacesRepository, documents: DocumentsRepository) {
    this.workspaces = workspaces;
    this.documents = documents;
  }

  async createWorkspace(name: string, isPrivate: boolean): Promise<string> {
    const id = await this.workspaces.createWorkspace(name, isPrivate);
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

  async getWorkspaces(): Promise<WorkspaceMeta[]> {
    return await this.workspaces.getWorkspaces();
  }

  async getWorkspace(id: string): Promise<WorkspaceMeta> {
    return await this.workspaces.getWorkspace(id);
  }

  async getResources(wid: string) {
    return await this.workspaces.getResources(wid);
  }
}
