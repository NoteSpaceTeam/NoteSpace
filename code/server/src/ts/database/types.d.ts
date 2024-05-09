import { DocumentStorageData } from '@notespace/shared/workspace/types/document';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { WorkspaceResource } from '@notespace/shared/workspace/types/resource';
import { WorkspaceInfo } from '@notespace/shared/workspace/types/workspace';

export type DocumentDatabase = {
  createDocument: (workspace: string, id : string) => Promise<string>;
  getDocument: (workspace : string, id: string) => Promise<DocumentStorageData>;
  deleteDocument: (workspace : string, id: string) => Promise<void>;
  updateDocument: (workspace : string, id: string, operations: Operation[]) => Promise<void>;
};

export type ResourceDatabase = {
  createResource: (resource : WorkspaceResource) => Promise<string>;
  getResource: (id : string) => Promise<WorkspaceResource>;
  updateResource: (newProps : Partial<WorkspaceResource>) => Promise<void>;
  deleteResource: (id : string) => Promise<void>;
};

export type WorkspaceDatabase = {
  createWorkspace : (title : string) => Promise<string>;
  getWorkspace : (id : string) => Promise<WorkspaceInfo>;
  updateWorkspace : (id : string, name : string) => Promise<void>;
  deleteWorkspace : (id : string) => Promise<void>;
  getWorkspaceResources : (workspace : string) => Promise<WorkspaceResource[]>;
};

export type NoteSpaceDatabase = {
  document: DocumentDatabase;
  resource: ResourceDatabase;
  workspace: WorkspaceDatabase;
};