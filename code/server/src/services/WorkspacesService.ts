import { Workspace, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { Databases } from '@databases/types';
import { ConflictError } from '@domain/errors/errors';
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

  async getWorkspaces(userId: string): Promise<WorkspaceMeta[]> {
    return await this.databases.workspaces.getWorkspaces(userId);
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
    const { userId, userInWorkspace } = await this.userInWorkspace(wid, email);
    if (userInWorkspace) throw new ConflictError('User already in workspace');
    await this.databases.workspaces.addWorkspaceMember(wid, userId);
  }

  async removeWorkspaceMember(wid: string, email: string) {
    const { userId, userInWorkspace } = await this.userInWorkspace(wid, email);
    if (!userInWorkspace) throw new ConflictError('User not in workspace');
    await this.databases.workspaces.removeWorkspaceMember(wid, userId);
  }

  private async userInWorkspace(wid: string, email: string) {
    validateId(wid);
    validateEmail(email);
    const user = await this.databases.users.getUserByEmail(email); // check if user with email exists
    const workspace = await this.databases.workspaces.getWorkspace(wid); // check if workspace exists
    return { userId: user.id, userInWorkspace: workspace.members.includes(email) }; // check if user in workspace
  }

  async searchWorkspaces(searchParams: SearchParams) {
    validatePositiveNumber(searchParams.skip);
    validatePositiveNumber(searchParams.limit);
    return await this.databases.workspaces.searchWorkspaces(searchParams);
  }
}
