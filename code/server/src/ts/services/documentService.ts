import { DocumentContent } from '@notespace/shared/workspace/types/document';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { DocumentDatabase } from '@database/types';
import { DocumentService } from '@services/types';

export default function DocumentService(database: DocumentDatabase): DocumentService {
  async function createDocument(workspace: string, id: string) {
    return await database.createDocument(workspace, id);
  }

  async function getDocument(workspace: string, id: string): Promise<DocumentContent> {
    return await database.getDocument(workspace, id);
  }

  async function deleteDocument(workspace: string, id: string) {
    await database.deleteDocument(workspace, id);
  }

  async function updateDocument(workspace: string, id: string, operations: Operation[]) {
    await database.updateDocument(workspace, id, operations);
  }

  return {
    createDocument,
    getDocument,
    deleteDocument,
    updateDocument,
  };
}
