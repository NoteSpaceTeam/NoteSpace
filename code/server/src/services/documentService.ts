import { DocumentDatabase } from '@src/types';
import {
  DeleteOperation,
  InsertOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';

export default function DocumentService(database: DocumentDatabase) {
  async function getTree() {
    return await database.getTree();
  }

  function deleteTree() {
    database.deleteTree();
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

  return {
    getTree,
    deleteTree,
    insertCharacter,
    deleteCharacter,
    updateInlineStyle,
    updateBlockStyle,
  };
}
