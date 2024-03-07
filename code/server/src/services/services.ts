export default function Services(database: Database) {
  function getTree() {
    return database.getTree();
  }

  function insertCharacter(msg: InsertMessage<unknown>) {
    if (msg.type !== 'insert') throw new Error('Invalid operation type');
    database.insertCharacter(msg);
  }

  function deleteCharacter(msg: DeleteMessage) {
    if (msg.type !== 'delete') throw new Error('Invalid operation type');
    database.deleteCharacter(msg);
  }

  return {
    getTree,
    insertCharacter,
    deleteCharacter,
  };
}
