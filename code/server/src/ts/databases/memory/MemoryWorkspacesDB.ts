import { WorkspacesRepository } from '@databases/types';
import { WorkspaceMetaData, WorkspaceResources } from '@notespace/shared/src/workspace/types/workspace';
import { memoryDB } from '@databases/memory/Memory';

export class MemoryWorkspacesDB implements WorkspacesRepository {
  async createWorkspace(name: string): Promise<string> {
    return memoryDB.createWorkspace(name);
  }
  async getWorkspaces(): Promise<WorkspaceMetaData[]> {
    return memoryDB.getWorkspaces();
  }
  async getWorkspace(id: string): Promise<WorkspaceMetaData> {
    return memoryDB.getWorkspace(id);
  }
  async getWorkspaceResources(id: string): Promise<WorkspaceResources> {
    return memoryDB.getWorkspace(id).resources;
  }
  async updateWorkspace(id: string, name: string): Promise<void> {
    return memoryDB.updateWorkspace(id, name);
  }
  async deleteWorkspace(id: string): Promise<void> {
    return memoryDB.deleteWorkspace(id);
  }
}
