import { DocumentDatabase, DocumentService } from '@src/types';
import {
  DeleteOperation,
  InsertOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';

export default function DocumentService(database: DocumentDatabase): DocumentService {
  async function getDocument() {
    return await database.getDocument();
  }

  function deleteDocument() {
    database.deleteDocument();
  }

  function insertCharacter(operation: InsertOperation) {
    if (operation.type !== 'insert') throw new Error('Invalid operation type');
    database.insertCharacter(operation);
  }

  function deleteCharacter(operation: DeleteOperation) {
    if (operation.type !== 'delete') throw new Error('Invalid operation type');
    database.deleteCharacter(operation);
  }

  function updateInlineStyle(operation: InlineStyleOperation) {
    if (operation.type !== 'inline-style') throw new Error('Invalid operation type');
    database.updateInlineStyle(operation);
  }

  function updateBlockStyle(operation: BlockStyleOperation) {
    if (operation.type !== 'block-style') throw new Error('Invalid operation type');
    database.updateBlockStyle(operation);
  }

  function updateTitle(title: string) {
    database.updateTitle(title);
  }

  return {
    getDocument,
    deleteDocument,
    insertCharacter,
    deleteCharacter,
    updateInlineStyle,
    updateBlockStyle,
    updateTitle,
  };
}
