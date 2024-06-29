import { DocumentResource, ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';
import { Databases } from '@databases/types';
import { validateEmail, validateId, validateName } from '@services/utils';

export class ResourcesService {
  private readonly databases: Databases;

  constructor(databases: Databases) {
    this.databases = databases;
  }

  async createResource(wid: string, name: string, type: ResourceType, parent?: string): Promise<string> {
    validateId(wid);
    validateName(name);
    if (parent) validateId(parent);
    const id = await this.databases.resources.createResource(wid, name, type, parent);
    if (type === ResourceType.DOCUMENT) await this.databases.documents.createDocument(wid, id);
    return id;
  }

  async getResource(wid: string, id: string, metaOnly: boolean = false): Promise<Resource> {
    validateId(wid);
    validateId(id);
    const resource = await this.databases.resources.getResource(id);
    if (resource.type === ResourceType.FOLDER || metaOnly) return resource;
    const { operations } = await this.databases.documents.getDocument(wid, id);
    return {
      ...resource,
      content: operations,
    } as DocumentResource;
  }

  async updateResource(id: string, newProps: Partial<Resource>): Promise<void> {
    validateId(id);
    if (newProps.id) throw new Error('Cannot update resource id');
    if (newProps.type) throw new Error('Cannot update resource type');
    if (newProps.workspace) throw new Error('Cannot update resource workspace');
    if (newProps.createdAt) throw new Error('Cannot update resource creation date');
    await this.databases.resources.updateResource(id, newProps);
  }

  async deleteResource(id: string): Promise<void> {
    validateId(id);
    const { type, workspace } = await this.databases.resources.getResource(id);
    await this.databases.resources.deleteResource(id);
    if (type === ResourceType.DOCUMENT) {
      await this.databases.documents.deleteDocument(workspace, id);
      await this.databases.commits.deleteCommits(id);
    }
  }

  async getRecentDocuments(email: string): Promise<DocumentResource[]> {
    validateEmail(email);
    const user = await this.databases.users.getUserByEmail(email);
    return this.databases.resources.getRecentDocuments(user.id);
  }
}
