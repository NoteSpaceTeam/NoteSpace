import { DocumentContent } from '@notespace/shared/src/workspace/types/document';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';

/**
 * Document Repository - Interface for handling resources content management
 */
export interface DocumentRepository {
  createDocument: (wid: string, id: string) => Promise<string>;
  getDocument: (wid: string, id: string) => Promise<DocumentContent>;
  deleteDocument: (wid: string, id: string) => Promise<void>;
  updateDocument: (wid: string, id: string, operations: Operation[]) => Promise<void>;
}

/**
 * Resource Repository - Interface for handling resources metadata management
 */
export interface ResourceRepository {
  createResource: (wid: string, name: string, type: ResourceType, parent: string) => Promise<string>;
  getResource: (id: string) => Promise<WorkspaceResource>;
  updateResource: (id: string, newProps: Partial<WorkspaceResource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
}

/**
 * Workspace Repository - Interface for handling workspace management
 */
export interface WorkspaceRepository {
  createWorkspace: (name: string) => Promise<string>;
  getWorkspaces: () => Promise<WorkspaceMetaData[]>;
  getWorkspace: (id: string) => Promise<WorkspaceMetaData>;
  updateWorkspace: (id: string, name: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  getWorkspaceResources: (id: string) => Promise<WorkspaceResource[]>;
}
