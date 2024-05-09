import { NotFoundError } from '@domain/errors/errors';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { DocumentDatabase } from '@database/types';
import { DocumentContent } from '@notespace/shared/workspace/types/document';

export default function DocumentMemoryDB(): DocumentDatabase {
  const documents: Record<string, DocumentContent> = {};

  async function createDocument(workspace : string, id : string) {
    documents[id] = { operations: [] };
    return id;
  }

  async function getDocument(workspace : string, id: string): Promise<DocumentContent> {
    const document = documents[id];
    if (!document) throw new NotFoundError(`Document with id ${id} not found`);

    return document;
  }

  async function deleteDocument(workspace : string, id: string) {
    const document = documents[id];
    if (!document) throw new NotFoundError(`Document with id ${id} not found`);

    delete documents[id];
  }

  async function updateDocument(workspace : string, id: string, operations: Operation[]) {
    const document = documents[id];
    if (!document) throw new NotFoundError(`Document with id ${id} not found`);

    documents[id] = { ...document, operations: [...document.operations, ...operations] };
  }

  return {
    createDocument,
    getDocument,
    deleteDocument,
    updateDocument,
  };
}
