import { NotFoundError } from '@domain/errors/errors';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { DocumentsRepository } from '@databases/types';
import { DocumentContent } from '@notespace/shared/src/workspace/types/document';

export class MemoryDocumentsDB implements DocumentsRepository {
  private readonly workspaces: Record<string, Record<string, DocumentContent>> = {};

  async createDocument(wid: string, id: string) {
    this.workspaces[wid][id] = { operations: [] };
    return id;
  }

  async getDocument(wid: string, id: string): Promise<DocumentContent> {
    return this.getDoc(wid, id);
  }

  async deleteDocument(wid: string, id: string) {
    this.getDoc(wid, id);
    delete this.workspaces[id];
  }

  async updateDocument(wid: string, id: string, operations: Operation[]) {
    const document = this.getDoc(wid, id);
    this.workspaces[wid][id].operations = [...document.operations, ...operations];
  }

  private getDoc(wid: string, id: string) {
    const workspace = this.workspaces[wid];
    if (!workspace) throw new NotFoundError(`Workspace not found`);

    const document = workspace[id];
    if (!document) throw new NotFoundError(`Document not found`);

    return document;
  }

  async addWorkspace(wid: string) {
    this.workspaces[wid] = {};
  }

  async removeWorkspace(wid: string) {
    delete this.workspaces[wid];
  }
}
