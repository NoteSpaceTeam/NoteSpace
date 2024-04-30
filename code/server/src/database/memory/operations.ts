import { DocumentDatabase } from '@src/types';
import { Document } from '@notespace/shared/crdt/types/document';
import { v4 as uuid } from 'uuid';
import { emptyTree } from '@notespace/shared/crdt/utils';
import { NotFoundError } from '@domain/errors/errors';

export default function DocumentMemoryDatabase(): DocumentDatabase {
  const documents: Record<string, Document> = {};

  async function getDocuments() {
    return Object.values(documents);
  }

  async function createDocument() {
    const id = uuid();
    documents[id] = {
      id,
      title: '',
      nodes: emptyTree(),
    };
    return id;
  }

  async function getDocument(id: string): Promise<Document> {
    const document = documents[id];
    if (!document) {
      throw new NotFoundError(`Document with id ${id} not found`);
    }
    return document;
  }

  async function updateDocument(id: string, newDocument: Partial<Document>) {
    const document = documents[id];
    if (!document) {
      throw new NotFoundError(`Document with id ${id} not found`);
    }
    documents[id] = { ...document, ...newDocument };
  }

  async function deleteDocument(id: string) {
    const document = documents[id];
    if (!document) {
      throw new NotFoundError(`Document with id ${id} not found`);
    }
    delete documents[id];
  }

  return {
    getDocuments,
    createDocument,
    getDocument,
    deleteDocument,
    updateDocument,
  };
}
