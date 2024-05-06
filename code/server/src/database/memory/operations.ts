import { DocumentDatabase } from '@src/types';
import { DocumentStorageData } from '@notespace/shared/crdt/types/document';
import { v4 as uuid } from 'uuid';
import { NotFoundError } from '@domain/errors/errors';
import { Operation } from '@notespace/shared/crdt/types/operations';

export default function DocumentMemoryDatabase(): DocumentDatabase {
  const documents: Record<string, DocumentStorageData> = {};

  async function getDocuments() {
    return Object.values(documents);
  }

  async function createDocument(title: string) {
    const id = uuid();
    documents[id] = { id, title, operations: [] };
    return id;
  }

  async function getDocument(id: string): Promise<DocumentStorageData> {
    const document = documents[id];
    if (!document) throw new NotFoundError(`Document with id ${id} not found`);

    return document;
  }

  async function deleteDocument(id: string) {
    const document = documents[id];
    if (!document) throw new NotFoundError(`Document with id ${id} not found`);

    delete documents[id];
  }

  async function updateDocument(id: string, operations: Operation[]) {
    const document = documents[id];
    if (!document) throw new NotFoundError(`Document with id ${id} not found`);

    documents[id] = { ...document, operations: [...document.operations, ...operations] };
  }

  async function updateTitle(id: string, title: string) {
    const document = documents[id];
    if (!document) throw new NotFoundError(`Document with id ${id} not found`);

    documents[id] = { ...document, title };
  }

  return {
    getDocuments,
    createDocument,
    getDocument,
    deleteDocument,
    updateDocument,
    updateTitle,
  };
}
