export default function Services(database: Database) {
  function getDocument() {
    return database.getDocument();
  }

  function insertCharacter(character: string) {
    database.insertCharacter(character);
  }

  function deleteCharacter(character: string) {
    database.deleteCharacter(character);
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
