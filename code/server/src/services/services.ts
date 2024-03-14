import { Database } from '@src/types';
import { DeleteMessage, InsertMessage } from '@shared/crdt/types';

export default function Services(database: Database) {
  async function getTree() {
    return await database.getTree();
  }

  function deleteTree() {
    database.deleteTree();
  }

  function insertCharacter(msg: InsertMessage<string>) {
    if (msg.type !== 'insert') throw new Error('Invalid operation type');
    database.insertCharacter(msg);
  }

  function deleteCharacter(msg: DeleteMessage) {
    if (msg.type !== 'delete') throw new Error('Invalid operation type');
    database.deleteCharacter(msg);
  }

  return {
    getTree,
    deleteTree,
    insertCharacter,
    deleteCharacter,
  };
}
