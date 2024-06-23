import { WorkspacesRepository } from '@databases/types';
import { Workspace, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { Memory } from '@databases/memory/Memory';
import { v4 as uuid } from 'uuid';
import { Resource, ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { omit } from 'lodash';
import { NotFoundError } from '@domain/errors/errors';
import { SearchParams } from '@src/utils/searchParams';

export class MemoryWorkspacesDB implements WorkspacesRepository {
  constructor() {
    Memory.reset();
  }

  async createWorkspace(name: string, isPrivate: boolean): Promise<string> {
    const id = uuid();
    const root: Resource = {
      id,
      name: 'root',
      workspace: id,
      type: ResourceType.FOLDER,
      parent: '',
      children: [],
      createdAt: '',
      updatedAt: '',
    };
    const now = new Date().toISOString();
    Memory.workspaces[id] = { id, name, isPrivate, resources: { [id]: root }, createdAt: now, members: [] };
    return id;
  }

  async getWorkspaces(userId: string): Promise<WorkspaceMeta[]> {
    return Object.values(Memory.workspaces)
      .filter(workspace => !workspace.isPrivate || workspace.members.includes(userId))
      .map(props => {
        const workspace = omit(props, ['resources']);
        return { ...workspace, members: workspace.members?.length || 0 };
      });
  }

  async getWorkspace(id: string): Promise<Workspace> {
    const workspace = Memory.workspaces[id];
    if (!workspace) throw new NotFoundError(`Workspace not found`);

    const resources = Object.values(workspace.resources);
    const members = await this.getWorkspaceMembers(workspace.id);
    return { ...workspace, resources, members };
  }

  async getResources(wid: string): Promise<Resource[]> {
    const workspace = await this.getWorkspace(wid);
    return workspace.resources;
  }

  async updateWorkspace(id: string, name: string): Promise<void> {
    const workspace = Memory.workspaces[id];
    if (!workspace) throw new NotFoundError(`Workspace not found`);

    Object.assign(workspace, { name });
  }

  async deleteWorkspace(id: string): Promise<void> {
    const workspace = Memory.workspaces[id];
    if (!workspace) throw new NotFoundError(`Workspace not found`);

    delete Memory.workspaces[id];
  }

  async addWorkspaceMember(wid: string, userId: string): Promise<void> {
    const workspace = Memory.workspaces[wid];
    if (!workspace) throw new NotFoundError(`Workspace not found`);
    Memory.workspaces[wid].members.push(userId);
  }

  async removeWorkspaceMember(wid: string, userId: string): Promise<void> {
    const workspace = Memory.workspaces[wid];
    if (!workspace) throw new NotFoundError(`Workspace not found`);
    Memory.workspaces[wid].members = Memory.workspaces[wid].members.filter(member => member !== userId);
  }

  async getWorkspaceMembers(wid: string): Promise<string[]> {
    const workspace = Memory.workspaces[wid];
    return workspace.members?.map(userId => Memory.users[userId].email) || [];
  }

  async searchWorkspaces(searchParams: SearchParams): Promise<WorkspaceMeta[]> {
    const { query, skip, limit } = searchParams;
    return Object.values(Memory.workspaces)
      .filter(workspace => !workspace.isPrivate) // public workspaces
      .filter(workspace => (query ? workspace.name.toLowerCase().includes(query.toLowerCase()) : true)) // search by name
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // sort results by creation date (newest first)
      .slice(skip, skip + limit) // paginate results
      .map(workspace => ({
        // convert to WorkspaceMeta
        ...omit(workspace, ['resources']),
        members: workspace.members?.length || 0,
      }));
  }
}
