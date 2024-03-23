import { DocumentDatabase } from '@src/types';
import { DeleteOperation, InsertOperation, StyleOperation } from '@notespace/shared/crdt/types/operations';

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

  function updateStyle(operation: StyleOperation) {
    if (operation.type !== 'style') throw new Error('Invalid operation type');
    database.updateStyle(operation);
  }

  return {
    getTree,
    deleteTree,
    insertCharacter,
    deleteCharacter,
    updateStyle,
  };
}
