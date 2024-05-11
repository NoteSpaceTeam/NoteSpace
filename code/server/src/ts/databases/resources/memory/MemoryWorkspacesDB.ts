import { WorkspacesRepository } from '@databases/types';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { memoryDB } from '@databases/resources/memory/utils';
import { WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';


export class MemoryWorkspacesDB implements WorkspacesRepository {
    getWorkspaceResources(id: string):Promise<WorkspaceResource[]>{
        return memoryDB.getWorkspaceResources(id);
    }
    createWorkspace(name: string): Promise<string> {
        return memoryDB.createWorkspace(name);
    }
    getWorkspaces(): Promise<WorkspaceMetaData[]> {
        return memoryDB.getWorkspaces();
    }
    getWorkspace(id: string): Promise<WorkspaceMetaData> {
        return memoryDB.getWorkspace(id);
    }
    updateWorkspace(id: string, name: string): Promise<void> {
        return memoryDB.updateWorkspace(id, name);
    }
    deleteWorkspace(id: string): Promise<void> {
        return memoryDB.deleteWorkspace(id);
    }
}