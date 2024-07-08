import { WorkspacesRepository } from '@databases/types';
import { Workspace, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { Memory } from '@databases/memory/Memory';
import { v4 as uuid } from 'uuid';
import { Resource, ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { omit } from 'lodash';
import { NotFoundError } from '@src/errors';
import { SearchParams } from '@src/utils/searchParams';

export class MemoryWorkspacesDB implements WorkspacesRepository {
  constructor() {
    Memory.reset();
  }

  async createWorkspace(name: string, isPrivate: boolean): Promise<string> {
    const id = uuid();
    const now = new Date().toISOString();
    const root: Resource = {
      id,
      name: 'root',
      workspace: id,
      type: ResourceType.FOLDER,
      parent: '',
      children: [],
      createdAt: now,
      updatedAt: now,
    };
    Memory.workspaces[id] = { id, name, isPrivate, resources: { [id]: root }, createdAt: now, members: [] };
    return id;
  }

  async getWorkspaces(email?: string): Promise<WorkspaceMeta[]> {
    const userId = email ? Object.values(Memory.users).find(user => user.email === email)?.id : undefined;
    return Object.values(Memory.workspaces)
      .filter(workspace => (userId ? workspace.members.includes(userId) : !workspace.isPrivate))
      .map(props => {
        const w = omit(props, ['resources']);
        return { ...w, members: w.members?.map(id => Memory.users[id].email) || [] };
      });
  }

  async getWorkspace(id: string): Promise<Workspace> {
    const workspace = Memory.workspaces[id];
    if (!workspace) throw new NotFoundError(`Workspace not found`);
    const resources = Object.values(workspace.resources);
    return { ...workspace, resources, members: workspace.members.map(id => Memory.users[id].email) };
  }

  async getResources(wid: string): Promise<Resource[]> {
    const workspace = await this.getWorkspace(wid);
    return workspace.resources;
  }

  async updateWorkspace(id: string, newProps: Partial<WorkspaceMeta>): Promise<void> {
    const workspace = Memory.workspaces[id];
    if (!workspace) throw new NotFoundError(`Workspace not found`);
    Object.assign(workspace, newProps);
  }

  async deleteWorkspace(id: string): Promise<void> {
    const workspace = Memory.workspaces[id];
    if (!workspace) throw new NotFoundError(`Workspace not found`);
    delete Memory.workspaces[id];
  }

  async addWorkspaceMember(wid: string, userId: string): Promise<string[]> {
    const workspace = Memory.workspaces[wid];
    if (!workspace) throw new NotFoundError(`Workspace not found`);
    Memory.workspaces[wid].members.push(userId);
    return Memory.workspaces[wid].members;
  }

  async removeWorkspaceMember(wid: string, userId: string): Promise<string[]> {
    const workspace = Memory.workspaces[wid];
    if (!workspace) throw new NotFoundError(`Workspace not found`);
    Memory.workspaces[wid].members = Memory.workspaces[wid].members.filter(member => member !== userId);
    return Memory.workspaces[wid].members;
  }

  async searchWorkspaces(searchParams: SearchParams, email?: string): Promise<WorkspaceMeta[]> {
    const { query, skip, limit } = searchParams;
    return Object.values(Memory.workspaces)
      .filter(workspace => !workspace.isPrivate || workspace.members.includes(email || '')) // filter accessible workspaces
      .filter(workspace => (query ? workspace.name.toLowerCase().includes(query.toLowerCase()) : true)) // search by name
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // sort results by creation date (newest first)
      .slice(skip, skip + limit) // paginate results
      .map(workspace => {
        // convert to WorkspaceMeta
        const w = omit(workspace, ['resources']);
        return { ...w, members: w.members?.map(id => Memory.users[id].email) || [] };
      });
  }
}
