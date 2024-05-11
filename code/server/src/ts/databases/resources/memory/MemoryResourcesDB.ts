import { ResourcesRepository } from '@databases/types';
import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import {memoryDB} from '@databases/resources/memory/utils';

export class MemoryResourcesDB implements ResourcesRepository {
    createResource(wid: string, name: string, type: ResourceType, parent?: string | undefined) : Promise<string>  {
      return Promise.resolve(memoryDB.addWorkspaceResource(wid, name));
    }
    getResource(id: string): Promise<WorkspaceResource> {
      return Promise.resolve(memoryDB.getWorkspaceResource(id));
    }
    updateResource(id: string, newProps: Partial<WorkspaceResource>): Promise<void> {
      return Promise.resolve(memoryDB.updateWorkspaceResource(id, newProps));
    }
    deleteResource(id: string): Promise<void> {
      return Promise.resolve(memoryDB.removeWorkspaceResource(id));
    }
}