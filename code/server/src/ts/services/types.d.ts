import { Document } from '@notespace/shared/workspace/types/document';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { Resource } from '@notespace/shared/workspace/types/resource';

export type DocumentService = {
  createDocument: (workspace: string, id : string) => Promise<string>;
  getDocument: (workspace :string, id: string) => Promise<Document>;
  deleteDocument: (workspace :string, id: string) => void;
  updateDocument: ( workspace : string, id: string, operations: Operation[]) => Promise<void>;
};

export type WorkspaceService = {
  getWorkspaceInfo : (workspace : string) => Promise<WorkspaceInfo>;
  getWorkspaceResources : (workspace : string) => Promise<Resource[]>;

  createResource : (resource : Resource) => Promise<string>;
  getResource : (id : string) => Promise<Resource>;
  updateResource : (resource : Resource) => Promise<void>;
  deleteResource : (id : string) => Promise<void>;
}