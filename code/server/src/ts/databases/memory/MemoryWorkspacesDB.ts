import { WorkspacesRepository } from '@databases/types';
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { memoryDB } from '@databases/memory/Memory';

export class MemoryWorkspacesDB implements WorkspacesRepository {
  constructor() {
    memoryDB.reset();
  }

  async createWorkspace(name: string, isPrivate: boolean): Promise<string> {
    return memoryDB.createWorkspace(name, isPrivate);
  }
  async getWorkspaces(): Promise<WorkspaceMeta[]> {
    return memoryDB.getWorkspaces();
  }
  async getWorkspace(id: string): Promise<WorkspaceMeta> {
    return memoryDB.getWorkspace(id);
  }
  async updateWorkspace(id: string, name: string): Promise<void> {
    return memoryDB.updateWorkspace(id, name);
  }
  async deleteWorkspace(id: string): Promise<void> {
    return memoryDB.deleteWorkspace(id);
  }
}
