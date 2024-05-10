import { Operation } from '@notespace/shared/crdt/types/operations';
import { DocumentDatabase } from '@database/types';

export class DocumentService {

  private readonly database: DocumentDatabase;

  constructor(database: DocumentDatabase) {
    this.database = database;
  }

  async updateDocument(workspace: string, id: string, operations: Operation[]) {
    await this.database.updateDocument(workspace, id, operations);
  }
}
