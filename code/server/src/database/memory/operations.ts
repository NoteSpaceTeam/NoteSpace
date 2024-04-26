import { DocumentDatabase } from '@src/types';
import { Document } from '@notespace/shared/crdt/types/document';
import { v4 as uuid } from 'uuid';
import { emptyTree } from '@notespace/shared/crdt/utils';

export default function DocumentDatabase(): DocumentDatabase {
  const documents: Record<string, Document> = {};

  async function createDocument() {
    const id = uuid();
    documents[id] = {
      title: '',
      nodes: emptyTree(),
    };
    return id;
  }

  async function getDocument(id: string): Promise<Document> {
    const document = documents[id];
    if (!document) {
      throw new Error(`Document with id ${id} not found with id`);
    }
    return document;
  }

  async function updateDocument(id: string, newDocument: Partial<Document>) {
    const document = documents[id];
    if (!document) {
      throw new Error(`Document with id ${id} not found with id`);
    }
    documents[id] = { ...document, ...newDocument };
  }

  async function deleteDocument(id: string) {
    const document = documents[id];
    if (!document) {
      throw new Error(`Document with id ${id} not found with id`);
    }
    delete documents[id];
  }

  return {
    createDocument,
    getDocument,
    deleteDocument,
    updateDocument,
  };
}
