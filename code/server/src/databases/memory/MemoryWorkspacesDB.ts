import { WorkspacesRepository } from '@databases/types';
import { Workspace, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { Memory } from '@databases/memory/Memory';
import { v4 as uuid } from 'uuid';
import { Resource, ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { omit } from 'lodash';
import { NotFoundError } from '@domain/errors/errors';

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
    Memory.workspaces[id] = { id, name, isPrivate, resources: { [id]: root }, createdAt: now, members: [''] };
    return id;
  }

  async getWorkspaces(): Promise<WorkspaceMeta[]> {
    return Object.values(Memory.workspaces).map(props => {
      return omit(props, ['resources']);
    });
  }

  async getWorkspace(id: string): Promise<Workspace> {
    const workspace = Memory.workspaces[id];
    if (!workspace) throw new NotFoundError(`Workspace not found`);

    const resources = Object.values(workspace.resources);
    return { ...workspace, resources };
  }

  async getResources(wid: string): Promise<Resource[]> {
    return (await this.getWorkspace(wid)).resources;
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
}
