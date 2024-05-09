import { DocumentStorageData } from '@notespace/shared/workspace/types/document';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { WorkspaceResource } from '@notespace/shared/workspace/types/resource';

export type DocumentDatabase = {
  createDocument: (workspace: string, id : string) => Promise<string>;
  getDocument: (workspace : string, id: string) => Promise<DocumentStorageData>;
  deleteDocument: (workspace : string, id: string) => Promise<void>;
  updateDocument: (workspace : string, id: string, operations: Operation[]) => Promise<void>;
};

export type WorkspaceDatabase = {
  getWorkspaceResources : (workspace : string) => Promise<WorkspaceResource[]>;
  createResource : (resource : WorkspaceResource) => Promise<string>;
  getResource : (id : string) => Promise<WorkspaceResource>;
  updateResource : (id : string, newProps : Partial<WorkspaceResource>) => Promise<void>;
  deleteResource : (id : string) => Promise<void>;
}
