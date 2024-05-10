import { DocumentStorageData } from '@notespace/shared/workspace/types/document';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { WorkspaceResource } from '@notespace/shared/workspace/types/resource';
import { WorkspaceInfo } from '@notespace/shared/workspace/types/workspace';

/**
 * Document Database - Interface for handling resources content management
 */
export interface DocumentDatabase {
  // Create a new document - saves the document content
  createDocument: (workspace: string, id : string) => Promise<string>;
  // Get document content by id
  getDocument: (workspace : string, id: string) => Promise<DocumentStorageData>;
  // Delete a document by id
  deleteDocument: (workspace : string, id: string) => Promise<void>;
  // Update a document by id
  updateDocument: (workspace : string, id: string, operations: Operation[]) => Promise<void>;
}

/**
 * Resource Database - Interface for handling resources metadata management
 */
export interface ResourceDatabase {
  // Create a new resource - saves the resource metadata
  createResource: (resource : WorkspaceResource) => Promise<string>;
  // Get a resource by its id
  getResource: (id : string) => Promise<WorkspaceResource>;
  // Update a resource by its id
  updateResource: (newProps : Partial<WorkspaceResource>) => Promise<void>;
  // Delete a resource by its id
  deleteResource: (id : string) => Promise<void>;
}

/**
 * Workspace Database - Interface for handling workspace management
 */
export interface WorkspaceDatabase {
  createWorkspace : (title : string) => Promise<string>;
  getWorkspace : (id : string) => Promise<WorkspaceInfo>;
  updateWorkspace : (id : string, name : string) => Promise<void>;
  deleteWorkspace : (id : string) => Promise<void>;
  getWorkspaceResources : (workspace : string) => Promise<WorkspaceResource[]>;
}

/**
 * NoteSpace Database - Interface for wrapping all database interfaces
 */
export interface NoteSpaceDatabase {
  document: DocumentDatabase;
  resource: ResourceDatabase;
  workspace: WorkspaceDatabase;
}