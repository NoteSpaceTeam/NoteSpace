let dataMem = '';

function getDocument() {
  return dataMem;
}

function updateDocument(content: string) {
  dataMem = content;
}

function deleteDocument() {
  dataMem = '';
}

export default {
  getDocument,
  updateDocument,
  deleteDocument,
};
