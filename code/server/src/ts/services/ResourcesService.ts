import { DocumentResource, ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { DocumentsRepository, ResourcesRepository } from '@databases/types';

export class ResourcesService {
  private readonly resources: ResourcesRepository;
  private readonly documents: DocumentsRepository;

  constructor(resources: ResourcesRepository, documents: DocumentsRepository) {
    this.resources = resources;
    this.documents = documents;
  }

  async createResource(wid: string, name: string, type: ResourceType, parent?: string): Promise<string> {
    const id = await this.resources.createResource(wid, name, type, parent || 'root');
    if (type === ResourceType.DOCUMENT) await this.documents.createDocument(wid, id);
    return id;
  }

  async getResource(wid: string, id: string, metaOnly: boolean = false): Promise<WorkspaceResource> {
    const resource = await this.resources.getResource(id);
    if (resource.type === ResourceType.FOLDER || metaOnly) return resource;
    const { operations } = await this.documents.getDocument(wid, id);
    return {
      ...resource,
      content: operations,
    } as DocumentResource;
  }

  async updateResource(id: string, resource: Partial<WorkspaceResource>): Promise<void> {
    await this.resources.updateResource(id, resource);
  }

  async deleteResource(id: string): Promise<void> {
    const { type, workspace } = await this.resources.getResource(id);
    await this.resources.deleteResource(id);
    if (type === ResourceType.DOCUMENT) await this.documents.deleteDocument(workspace, id);
  }
}
