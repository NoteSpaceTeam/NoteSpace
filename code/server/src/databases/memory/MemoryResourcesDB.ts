import { ResourcesRepository } from '@databases/types';
import { ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';
import { Memory } from '@databases/memory/Memory';
import { NotFoundError } from '@domain/errors/errors';
import { v4 as uuid } from 'uuid';

export class MemoryResourcesDB implements ResourcesRepository {
  constructor() {
    Memory.reset();
  }

  async createResource(wid: string, name: string, type: ResourceType, parent?: string): Promise<string> {
    return this._createResource(wid, name, type, parent);
  }

  private _createResource(wid: string, name: string, type: ResourceType, parent?: string): string {
    const workspace = Memory.workspaces[wid];
    if (!workspace) throw new NotFoundError(`Workspace not found`);

    const id = uuid();
    // Create resource
    Object.assign(workspace.resources[id], {
      id,
      name,
      workspace: wid,
      type,
      parent: parent || wid,
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // update parent
    if (parent) {
      const parentResource = this._getResource(parent);
      parentResource.children.push(id);
    }
    return id;
  }

  async getResource(id: string): Promise<Resource> {
    return this._getResource(id);
  }

  private _getResource(id: string): Resource {
    for (const workspace of Object.values(Memory.workspaces)) {
      const resource = workspace.resources[id];
      if (resource) return resource;
    }
    throw new NotFoundError(`Resource not found`);
  }

  async updateResource(id: string, newProps: Partial<Resource>): Promise<void> {
    return this._updateResource(id, newProps);
  }

  private _updateResource(id: string, newProps: Partial<Resource>): void {
    const resource = this._getResource(id);
    Object.assign(resource, newProps);

    if (newProps.parent) {
      const prevParent = this._getResource(resource.parent);
      prevParent.children = prevParent.children.filter((childId: string) => childId !== id);
      const newParent = this._getResource(newProps.parent);
      newParent.children.push(id);
    }
  }

  async deleteResource(id: string): Promise<void> {
    return this._deleteResource(id);
  }

  private _deleteResource(id: string): void {
    const resource = this._getResource(id);
    const parentResource = this._getResource(resource.parent);

    // remove from parent
    parentResource.children = parentResource.children.filter((childId: string) => childId !== id);

    // do the same for all children recursively
    resource.children.forEach((childId: any) => this.deleteResource(childId));

    // delete resource
    delete Memory.workspaces[resource.workspace].resources[id];
  }
}
