import { DocumentContent } from '@notespace/shared/src/workspace/types/document';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';

export interface DocumentsRepository {
  createDocument: (wid: string, id: string) => Promise<string>;
  getDocument: (wid: string, id: string) => Promise<DocumentContent>;
  deleteDocument: (wid: string, id: string) => Promise<void>;
  updateDocument: (wid: string, id: string, operations: Operation[]) => Promise<void>;
  addWorkspace: (wid: string) => Promise<void>;
  removeWorkspace: (wid: string) => Promise<void>;
}

export interface ResourcesRepository {
  createResource: (wid: string, name: string, type: ResourceType, parent?: string) => Promise<string>;
  getResource: (id: string) => Promise<Resource>;
  updateResource: (id: string, newProps: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  getResources: (wid: string) => Promise<Resource[]>;
}

export interface WorkspacesRepository {
  createWorkspace: (name: string) => Promise<string>;
  getWorkspaces: () => Promise<WorkspaceMeta[]>;
  getWorkspace: (id: string) => Promise<WorkspaceMeta>;
  updateWorkspace: (id: string, name: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
}

export interface Databases {
  readonly document: DocumentsRepository;
  readonly resource: ResourcesRepository;
  readonly workspace: WorkspacesRepository;
}
