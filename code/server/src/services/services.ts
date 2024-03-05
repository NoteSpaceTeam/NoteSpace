export default function Services(database: Database) {
  function getDocument() {
    return database.getDocument();
  }

  function insertCharacter(data: string[]) {
    database.insertCharacter(data);
  }

  function deleteCharacter(data: string[]) {
    database.deleteCharacter(data);
  }

  function deleteDocument() {
    database.deleteDocument();
  }

  return {
    getDocument,
    insertCharacter,
    deleteCharacter,
    deleteDocument,
  };
}
