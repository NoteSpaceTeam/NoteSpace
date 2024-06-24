import { DocumentResource, ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';
import { Databases } from '@databases/types';

export class ResourcesService {
  private readonly databases: Databases;

  constructor(databases: Databases) {
    this.databases = databases;
  }

  async createResource(wid: string, name: string, type: ResourceType, parent?: string): Promise<string> {
    const id = await this.databases.resources.createResource(wid, name, type, parent);
    if (type === ResourceType.DOCUMENT) await this.databases.documents.createDocument(wid, id);
    return id;
  }

  async getResource(wid: string, id: string, metaOnly: boolean = false): Promise<Resource> {
    const resource = await this.databases.resources.getResource(id);
    if (resource.type === ResourceType.FOLDER || metaOnly) return resource;
    const { operations } = await this.databases.documents.getDocument(wid, id);
    return {
      ...resource,
      content: operations,
    } as DocumentResource;
  }

  async updateResource(id: string, resource: Partial<Resource>): Promise<void> {
    await this.databases.resources.updateResource(id, resource);
  }

  async deleteResource(id: string): Promise<void> {
    const { type, workspace } = await this.databases.resources.getResource(id);
    await this.databases.resources.deleteResource(id);
    if (type === ResourceType.DOCUMENT) {
      await this.databases.documents.deleteDocument(workspace, id);
      await this.databases.commits.deleteCommits(id);
    }
  }
}
