import { DocumentContent } from '@notespace/shared/workspace/document';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { WorkspaceResource } from '@notespace/shared/workspace/resource';
import { WorkspaceMetaData } from '@notespace/shared/workspace/workspace';

/**
 * Document Database - Interface for handling resources content management
 */
export interface DocumentDatabase {
  createDocument: (wid: string, id: string) => Promise<string>;
  getDocument: (wid: string, id: string) => Promise<DocumentContent>;
  deleteDocument: (wid: string, id: string) => Promise<void>;
  updateDocument: (wid: string, id: string, operations: Operation[]) => Promise<void>;
}

/**
 * Resource Database - Interface for handling resources metadata management
 */
export interface ResourceDatabase {
  createResource: (resource: WorkspaceResource) => Promise<string>;
  getResource: (id: string) => Promise<WorkspaceResource>;
  updateResource: (newProps: Partial<WorkspaceResource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
}

/**
 * Workspace Database - Interface for handling workspace management
 */
export interface WorkspaceDatabase {
  createWorkspace: (name: string) => Promise<string>;
  getWorkspace: (id: string) => Promise<WorkspaceMetaData>;
  updateWorkspace: (id: string, name: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  getWorkspaceResources: (id: string) => Promise<WorkspaceResource[]>;
}

/**
 * NoteSpace Database - Interface for wrapping all database interfaces
 */
// export interface NoteSpaceDatabase {
//   document: DocumentDatabase;
//   resource: ResourceDatabase;
//   workspace: WorkspaceDatabase;
// }
