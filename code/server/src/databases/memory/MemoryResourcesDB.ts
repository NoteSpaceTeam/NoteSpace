import { ResourcesRepository } from '@databases/types';
import { ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';
import { Memory } from '@databases/memory/Memory';
import { NotFoundError } from '@domain/errors/errors';
import { v4 as uuid } from 'uuid';

export class MemoryResourcesDB implements ResourcesRepository {
  constructor() {
    Memory.reset();
  }

  async createResource(wid: string, name: string, type: ResourceType, parent?: string) {
    const workspace = Memory.workspaces[wid];
    if (!workspace) throw new NotFoundError(`Workspace not found`);

    // create resource
    const id = uuid();
    workspace.resources[id] = {
      id,
      name,
      workspace: wid,
      type,
      parent: parent || wid,
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // update parent
    if (parent) {
      const parentResource = this.getResourceById(parent);
      parentResource.children.push(id);
    }
    return id;
  }

  async getResource(id: string): Promise<Resource> {
    return this.getResourceById(id);
  }

  async updateResource(id: string, newProps: Partial<Resource>) {
    const resource = this.getResourceById(id);
    Object.assign(resource, newProps);

    if (newProps.parent) {
      const prevParent = this.getResourceById(resource.parent);
      prevParent.children = prevParent.children.filter((childId: string) => childId !== id);
      const newParent = this.getResourceById(newProps.parent);
      newParent.children.push(id);
    }
  }

  async deleteResource(id: string) {
    const resource = await this.getResource(id);
    const parentResource = await this.getResource(resource.parent);

    // remove from parent
    parentResource.children = parentResource.children.filter(childId => childId !== id);

    // do the same for all children recursively
    for (const childId of resource.children) {
      await this.deleteResource(childId);
    }

    // delete resource
    delete Memory.workspaces[resource.workspace].resources[id];
    console.log(Memory.workspaces[resource.workspace].resources[id]);
  }

  private getResourceById(id: string) {
    for (const workspace of Object.values(Memory.workspaces)) {
      const resource = workspace.resources[id];
      if (resource) return resource;
    }
    throw new NotFoundError(`Resource not found`);
  }
}
