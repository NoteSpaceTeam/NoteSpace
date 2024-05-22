import { ResourcesRepository } from '@databases/types';
import { ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';
import { memoryDB } from '@databases/memory/Memory';

export class MemoryResourcesDB implements ResourcesRepository {
  constructor() {
    memoryDB.reset();
  }

  async createResource(wid: string, name: string, type: ResourceType, parent?: string): Promise<string> {
    return memoryDB.createResource(wid, name, type, parent);
  }
  async getResource(id: string): Promise<Resource> {
    return memoryDB.getResource(id);
  }
  async updateResource(id: string, newProps: Partial<Resource>): Promise<void> {
    return memoryDB.updateResource(id, newProps);
  }
  async deleteResource(id: string): Promise<void> {
    return memoryDB.deleteResource(id);
  }
  async getResources(wid: string): Promise<Resource[]> {
    return memoryDB.getWorkspace(wid).resources;
  }
}
