import { ResourcesRepository } from '@databases/types';
import { ResourceType, Resource, DocumentResource } from '@notespace/shared/src/workspace/types/resource';
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
    const now = new Date().toISOString();
    workspace.resources[id] = {
      id,
      name,
      workspace: wid,
      type,
      parent: parent || wid,
      children: [],
      createdAt: now,
      updatedAt: now,
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
    if (newProps.parent) {
      const prevParent = this.getResourceById(resource.parent);
      prevParent.children = prevParent.children.filter((childId: string) => childId !== id);
      const newParent = this.getResourceById(newProps.parent);
      newParent.children.push(id);
    }
    Object.assign(resource, newProps);
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
  }

  private getResourceById(id: string) {
    for (const workspace of Object.values(Memory.workspaces)) {
      const resource = workspace.resources[id];
      if (resource) return resource;
    }
    throw new NotFoundError(`Resource not found`);
  }

  async getRecentDocuments(email: string): Promise<DocumentResource[]> {
    return Object.values(Memory.workspaces)
      .filter(workspace => workspace.members.includes(email))
      .flatMap(workspace => Object.values(workspace.resources))
      .filter(resource => resource.type === ResourceType.DOCUMENT)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10) as DocumentResource[];
  }
}
