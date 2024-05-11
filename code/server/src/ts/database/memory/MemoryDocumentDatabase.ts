import { NotFoundError } from '@domain/errors/errors';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { DocumentRepository } from '@database/types';
import { DocumentContent } from '@notespace/shared/src/workspace/types/document';

export class MemoryDocumentDatabase implements DocumentRepository {
  private readonly documents: Record<string, Record<string, DocumentContent>> = {};

  async createDocument(wid: string, id: string) {
    this.documents[wid][id] = { operations: [] };
    return id;
  }

  async getDocument(wid: string, id: string): Promise<DocumentContent> {
    return this.getDoc(wid, id);
  }

  async deleteDocument(wid: string, id: string) {
    this.getDoc(wid, id);
    delete this.documents[id];
  }

  async updateDocument(wid: string, id: string, operations: Operation[]) {
    const document = this.getDoc(wid, id);
    this.documents[wid][id].operations = [...document.operations, ...operations];
  }

  private getDoc(wid: string, id: string) {
    const workspace = this.documents[wid];
    if (!workspace) throw new NotFoundError(`Workspace with id ${wid} not found`);
    const document = workspace[id];
    if (!document) throw new NotFoundError(`Document with id ${id} not found`);
    return document;
  }
}
