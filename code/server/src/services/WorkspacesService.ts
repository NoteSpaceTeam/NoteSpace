import { Workspace, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { Databases } from '@databases/types';
import { validateEmail, validateId, validateName, validatePositiveNumber } from '@services/utils';
import { SearchParams } from '@src/utils/searchParams';

export class WorkspacesService {
  private readonly databases: Databases;

  constructor(databases: Databases) {
    this.databases = databases;
  }

  async createWorkspace(name: string, isPrivate: boolean): Promise<string> {
    validateName(name);
    const id = await this.databases.workspaces.createWorkspace(name, isPrivate);
    await this.databases.documents.addWorkspace(id);
    return id;
  }

  async updateWorkspace(id: string, newProps: Partial<WorkspaceMeta>) {
    validateId(id);
    if (newProps.name) validateName(newProps.name);
    if (newProps.id) throw new Error('Cannot update workspace id');
    if (newProps.createdAt) throw new Error('Cannot update workspace createdAt');
    if (newProps.members) throw new Error('Cannot update workspace members');
    await this.databases.workspaces.updateWorkspace(id, newProps);
  }

  async deleteWorkspace(id: string) {
    validateId(id);
    await this.databases.workspaces.deleteWorkspace(id);
    await this.databases.documents.removeWorkspace(id);
  }

  async getWorkspaces(email?: string): Promise<WorkspaceMeta[]> {
    if (email) validateEmail(email);
    return await this.databases.workspaces.getWorkspaces(email);
  }

  async getWorkspace(id: string): Promise<Workspace> {
    validateId(id);
    return await this.databases.workspaces.getWorkspace(id);
  }

  async getResources(wid: string) {
    validateId(wid);
    return await this.databases.workspaces.getResources(wid);
  }

  async addWorkspaceMember(wid: string, email: string): Promise<string[]> {
    validateId(wid);
    validateEmail(email);
    await this.databases.users.getUserByEmail(email); // ensure user exists
    return await this.databases.workspaces.addWorkspaceMember(wid, email);
  }

  async removeWorkspaceMember(wid: string, email: string): Promise<string[]> {
    validateId(wid);
    validateEmail(email);
    await this.databases.users.getUserByEmail(email); // ensure user exists
    return await this.databases.workspaces.removeWorkspaceMember(wid, email);
  }

  async searchWorkspaces(searchParams: SearchParams, email?: string) {
    validatePositiveNumber(searchParams.skip);
    validatePositiveNumber(searchParams.limit);
    return await this.databases.workspaces.searchWorkspaces(searchParams, email);
  }
}
