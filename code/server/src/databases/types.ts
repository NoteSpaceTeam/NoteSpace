import { DocumentContent } from '@notespace/shared/src/workspace/types/document';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { UserData } from '@notespace/shared/src/users/types';

export interface DocumentsRepository {
  /**
   * Create a document in the database
   * @param wid
   * @param id
   */
  createDocument: (wid: string, id: string) => Promise<string>;
  /**
   * Get a document from the database
   * @param wid
   * @param id
   */
  getDocument: (wid: string, id: string) => Promise<DocumentContent>;
  /**
   * Delete a document from the database
   * @param wid
   * @param id
   */
  deleteDocument: (wid: string, id: string) => Promise<void>;
  /**
   * Update a document in the database
   * @param wid
   * @param id
   * @param operations
   */
  updateDocument: (wid: string, id: string, operations: Operation[]) => Promise<void>;
  /**
   * Add a workspace to the database
   * @param wid
   */
  addWorkspace: (wid: string) => Promise<void>;
  /**
   * Remove a workspace from the database
   * @param wid
   */
  removeWorkspace: (wid: string) => Promise<void>;
}

export interface ResourcesRepository {
  /**
   * Create a resource in the database
   * @param wid
   * @param name
   * @param type
   * @param parent
   */
  createResource: (wid: string, name: string, type: ResourceType, parent?: string) => Promise<string>;
  /**
   * Get a resource from the database
   * @param id
   */
  getResource: (id: string) => Promise<Resource>;
  /**
   * Update a resource in the database
   * @param id
   * @param newProps
   */
  updateResource: (id: string, newProps: Partial<Resource>) => Promise<void>;
  /**
   * Delete a resource from the database
   * @param id
   */
  deleteResource: (id: string) => Promise<void>;
}

export interface WorkspacesRepository {
  /**
   * Create a workspace in the database
   * @param name
   * @param isPrivate
   */
  createWorkspace: (name: string, isPrivate: boolean) => Promise<string>;
  /**
   * Get all workspaces from the database
   */
  getWorkspaces: () => Promise<WorkspaceMeta[]>;
  /**
   * Get a workspace from the database
   * @param id
   */
  getWorkspace: (id: string) => Promise<WorkspaceMeta>;
  /**
   * Get all resources in a workspace
   * @param wid
   */
  getResources: (wid: string) => Promise<Resource[]>;
  /**
   * Update a workspace in the database
   * @param id
   * @param name
   */
  updateWorkspace: (id: string, name: string) => Promise<void>;
  /**
   * Delete a workspace from the database
   * @param id
   */
  deleteWorkspace: (id: string) => Promise<void>;
}

export interface UsersRepository {
  /**
   * Create a user in the database
   * @param id
   * @param data
   */
  createUser: (id: string, data: UserData) => Promise<void>;
  /**
   * Get a user from the database
   * @param id
   */
  getUser: (id: string) => Promise<UserData>;
  /**
   * Update a user in the database
   * @param id
   * @param newProps
   */
  updateUser: (id: string, newProps: Partial<UserData>) => Promise<void>;
  /**
   * Delete a user from the database
   * @param id
   */
  deleteUser: (id: string) => Promise<void>;
}

export interface Databases {
  readonly documents: DocumentsRepository;
  readonly resources: ResourcesRepository;
  readonly workspaces: WorkspacesRepository;
  readonly users: UsersRepository;
}
