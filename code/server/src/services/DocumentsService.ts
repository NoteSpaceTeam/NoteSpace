import { Operation } from '@notespace/shared/src/document/types/operations';
import { Databases } from '@databases/types';

export class DocumentsService {
  private readonly databases: Databases;

  constructor(databases: Databases) {
    this.databases = databases;
  }

  async updateDocument(wid: string, id: string, operations: Operation[]) {
    // update document operations
    await this.databases.documents.updateDocument(wid, id, operations);

    // update resource modified time
    await this.databases.resources.updateResource(id, { updatedAt: new Date().toISOString() });
  }
}
