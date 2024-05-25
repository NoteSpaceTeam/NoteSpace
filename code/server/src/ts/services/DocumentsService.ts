import { Operation } from '@notespace/shared/src/document/types/operations';
import { DocumentsRepository, ResourcesRepository } from '@databases/types';

export class DocumentsService {
  private readonly documents: DocumentsRepository;
  private readonly resources: ResourcesRepository;

  constructor(documents: DocumentsRepository, resources: ResourcesRepository) {
    this.documents = documents;
    this.resources = resources;
  }

  async updateDocument(wid: string, id: string, operations: Operation[]) {
    // update document operations
    await this.documents.updateDocument(wid, id, operations);

    // update resource modified time
    await this.resources.updateResource(id, { updatedAt: new Date().toISOString() });
  }
}
