export default function Services(database: Database) {
  function getDocument() {
    return database.getDocument();
  }

  function updateDocument(content: string) {
    database.updateDocument(content);
  }

  function deleteDocument() {
    database.deleteDocument();
  }

  return {
    getDocument,
    updateDocument,
    deleteDocument,
  };
}
