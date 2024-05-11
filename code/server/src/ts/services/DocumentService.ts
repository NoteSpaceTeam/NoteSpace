import { Operation } from '@notespace/shared/src/document/types/operations';
import { DocumentRepository } from '@database/types';

export class DocumentService {
  private readonly database: DocumentRepository;

  constructor(database: DocumentRepository) {
    this.database = database;
  }

  async addOperations(wid: string, id: string, operations: Operation[]) {
    await this.database.updateDocument(wid, id, operations);
  }
}
