import { Operation } from '@notespace/shared/src/document/types/operations';
import { DocumentsRepository } from '@databases/types';

export class DocumentsService {
  private readonly database: DocumentsRepository;

  constructor(database: DocumentsRepository) {
    this.database = database;
  }

  async updateDocument(wid: string, id: string, operations: Operation[]) {
    await this.database.updateDocument(wid, id, operations);
  }
}
