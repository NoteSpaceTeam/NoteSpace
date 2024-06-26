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

  async updateWorkspace(id: string, name: string) {
    validateId(id);
    validateName(name);
    await this.databases.workspaces.updateWorkspace(id, name);
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

  async addWorkspaceMember(wid: string, email: string) {
    validateId(wid);
    validateEmail(email);
    await this.databases.workspaces.addWorkspaceMember(wid, email);
  }

  async removeWorkspaceMember(wid: string, email: string) {
    validateId(wid);
    validateEmail(email);
    await this.databases.workspaces.removeWorkspaceMember(wid, email);
  }

  async searchWorkspaces(searchParams: SearchParams) {
    validatePositiveNumber(searchParams.skip);
    validatePositiveNumber(searchParams.limit);
    return await this.databases.workspaces.searchWorkspaces(searchParams);
  }
}
