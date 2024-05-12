import { ResourcesRepository } from '@databases/types';
import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { memoryDB } from '@databases/memory/Memory';

export class MemoryResourcesDB implements ResourcesRepository {
  async createResource(wid: string, name: string, type: ResourceType, parent?: string): Promise<string> {
    return memoryDB.createResource(wid, name, type, parent);
  }
  async getResource(id: string): Promise<WorkspaceResource> {
    return memoryDB.getResource(id);
  }
  async updateResource(id: string, newProps: Partial<WorkspaceResource>): Promise<void> {
    return memoryDB.updateResource(id, newProps);
  }
  async deleteResource(id: string): Promise<void> {
    return memoryDB.deleteResource(id);
  }
}
