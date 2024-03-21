import { Database } from '@src/types';
import { DeleteOperation, InsertOperation, StyleOperation } from '@notespace/shared/crdt/operations';

export default function Services(database: Database) {
  async function getTree() {
    return await database.getTree();
  }

  function deleteTree() {
    database.deleteTree();
  }

  function insertCharacter(msg: InsertOperation<string>) {
    if (msg.type !== 'insert') throw new Error('Invalid operation type');
    database.insertCharacter(msg);
  }

  function deleteCharacter(msg: DeleteOperation) {
    if (msg.type !== 'delete') throw new Error('Invalid operation type');
    database.deleteCharacter(msg);
  }

  function updateStyle(msg: StyleOperation) {
    if (msg.type !== 'style') throw new Error('Invalid operation type');
    database.updateStyle(msg);
  }

  return {
    getTree,
    deleteTree,
    insertCharacter,
    deleteCharacter,
    updateStyle,
  };
}
