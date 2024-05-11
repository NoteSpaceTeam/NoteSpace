import { DocumentResource, ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { DocumentRepository, ResourceRepository } from '@database/types';

export class ResourcesService {
  private readonly resources: ResourceRepository;
  private readonly documents: DocumentRepository;

  constructor(resourcesDB: ResourceRepository, documents: DocumentRepository) {
    this.resources = resourcesDB;
    this.documents = documents;
  }

  async createResource(wid: string, name: string, type: ResourceType, parent: string): Promise<string> {
    return await this.resources.createResource(wid, name, type, parent);
  }

  async getResource(wid: string, rid: string, metaOnly: boolean): Promise<WorkspaceResource> {
    const resource = await this.resources.getResource(rid);
    if (resource.type === ResourceType.FOLDER || metaOnly) return resource;
    const { operations } = await this.documents.getDocument(wid, rid);
    return {
      ...resource,
      content: operations,
    } as DocumentResource;
  }

  async updateResource(id: string, resource: Partial<WorkspaceResource>): Promise<void> {
    await this.resources.updateResource(id, resource);
  }

  async deleteResource(id: string): Promise<void> {
    await this.resources.deleteResource(id);
  }
}
