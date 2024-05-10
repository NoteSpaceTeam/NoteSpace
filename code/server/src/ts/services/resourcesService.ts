import { ResourcesDB } from '@database/pg/resourcesDB';
import { ResourceInputModel, ResourceType, WorkspaceResource } from '../../../../shared/workspace/resource';
import { DocumentDatabase } from '@database/types';

export class ResourcesService {

  private readonly resources: ResourcesDB
  private readonly documents: DocumentDatabase;

  constructor(resourcesDB: ResourcesDB, documents: DocumentDatabase) {
    this.resources = resourcesDB;
    this.documents = documents;
  }

  async createResource(resource: ResourceInputModel): Promise<string> {
    return await this.resources.createResource(resource);
  }

  async getResource(id: string): Promise<WorkspaceResource> {
    return await this.resources.getResource(id);
  }

  async getDocContent(wid: string, rid: string): Promise<string> {
    const resource = await this.resources.getResource(rid);
    if (resource.type !== ResourceType.DOCUMENT) throw new Error('Resource is not a document');
    return this.documents.getDocument(wid, rid);
  }

  async updateResource(resource: Partial<WorkspaceResource>): Promise<void> {
    await this.resources.updateResource(resource);
  }

  async deleteResource(id: string): Promise<void> {
    await this.resources.deleteResource(id);
  }
}