import { DocumentDatabase, DocumentService } from '@src/types';
import { Document } from '@notespace/shared/crdt/types/document';
import { Operation } from '@notespace/shared/crdt/types/operations';

export default function DocumentService(database: DocumentDatabase): DocumentService {
  async function getDocuments() {
    return await database.getDocuments();
  }

  async function createDocument() {
    return await database.createDocument();
  }

  async function getDocument(id: string): Promise<Document> {
    const { title, operations } = await database.getDocument(id);
    return { id, title, operations: operations };
  }

  async function deleteDocument(id: string) {
    await database.deleteDocument(id);
  }

  async function updateDocument(id: string, operations: Operation[]) {
    await database.updateDocument(id, operations);
  }

  async function updateTitle(id: string, title: string) {
    await database.updateTitle(id, title);
  }

  return {
    getDocuments,
    createDocument,
    getDocument,
    deleteDocument,
    updateTitle,
    updateDocument,
  };
}
