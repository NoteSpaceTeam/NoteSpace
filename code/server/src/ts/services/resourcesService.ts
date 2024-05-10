import {
  DocumentResource,
  ResourceInputModel,
  ResourceType,
  WorkspaceResource,
} from '@notespace/shared/workspace/resource';
import { ResourcesDB } from '@database/pg/resourcesDB';
import { DocumentDatabase } from '@database/types';

export class ResourcesService {
  private readonly resources: ResourcesDB;
  private readonly documents: DocumentDatabase;

  constructor(resourcesDB: ResourcesDB, documents: DocumentDatabase) {
    this.resources = resourcesDB;
    this.documents = documents;
  }

  async createResource(resource: ResourceInputModel): Promise<string> {
    return await this.resources.createResource(resource);
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

  async updateResource(resource: Partial<WorkspaceResource>): Promise<void> {
    await this.resources.updateResource(resource);
  }

  async deleteResource(id: string): Promise<void> {
    await this.resources.deleteResource(id);
  }
}
