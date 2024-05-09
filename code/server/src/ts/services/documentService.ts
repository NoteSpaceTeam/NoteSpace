import { DocumentContent } from '@notespace/shared/workspace/types/document';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { DocumentDatabase } from '@database/types';

export class DocumentService {

  private readonly database: DocumentDatabase;

  constructor(database: DocumentDatabase) {
    this.database = database;
  }

  async getDocument(workspace: string, id: string): Promise<DocumentContent> {
    return await this.database.getDocument(workspace, id);
  }

  async updateDocument(workspace: string, id: string, operations: Operation[]) {
    await this.database.updateDocument(workspace, id, operations);
  }
}
