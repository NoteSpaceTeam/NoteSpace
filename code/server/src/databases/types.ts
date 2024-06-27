import { DocumentContent } from '@notespace/shared/src/workspace/types/document';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { ResourceType, Resource, DocumentResource } from '@notespace/shared/src/workspace/types/resource';
import { Workspace, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { User } from '@notespace/shared/src/users/types';
import { SearchParams } from '@src/utils/searchParams';
import { Commit, CommitMeta } from '@notespace/shared/src/document/types/commits';

export interface DocumentsRepository {
  /**
   * Create a document in the database
   * @param wid
   * @param id
   */
  createDocument: (wid: string, id: string) => Promise<void>;
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
  updateDocument: (wid: string, id: string, operations: Operation[], replace: boolean) => Promise<void>;
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
  /** Get resources recently edited by a user
   * @param email
   */
  getRecentDocuments: (email: string) => Promise<DocumentResource[]>;
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
   * If email is provided, get user workspaces, otherwise get all public workspaces
   * @param email
   */
  getWorkspaces: (email?: string) => Promise<WorkspaceMeta[]>;
  /**
   * Get a workspace from the database
   * @param id
   */
  getWorkspace: (id: string) => Promise<Workspace>;
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
  /**
   * Add a member to a workspace
   * @param wid
   * @param email
   */
  addWorkspaceMember: (wid: string, email: string) => Promise<void>;
  /**
   * Remove a member from a workspace
   * @param wid
   * @param email
   */
  removeWorkspaceMember: (wid: string, email: string) => Promise<void>;
  /**
   * Search workspaces by name
   * @param searchParams
   */
  searchWorkspaces: (searchParams: SearchParams) => Promise<WorkspaceMeta[]>;
}

export interface UsersRepository {
  /**
   * Create a user in the database
   * @param id
   * @param name
   * @param email
   */
  createUser: (id: string, name: string, email: string) => Promise<void>;
  /**
   * Get a user from the database
   * @param id
   */
  getUser: (id: string) => Promise<User>;
  /**
   * Delete a user from the database
   * @param id
   */
  deleteUser: (id: string) => Promise<void>;
  /**
   * Get all users from the database
   */
  getUsers: () => Promise<User[]>;
}

export interface CommitsRepository {
  saveCommit: (id: string, commit: Commit) => Promise<void>;
  getCommit: (id: string, commitId: string) => Promise<Commit>;
  getCommits: (id: string) => Promise<CommitMeta[]>;
  deleteCommits: (id: string) => Promise<void>;
}

export interface Databases {
  readonly documents: DocumentsRepository;
  readonly commits: CommitsRepository;
  readonly resources: ResourcesRepository;
  readonly workspaces: WorkspacesRepository;
  readonly users: UsersRepository;
}
