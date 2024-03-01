let dataMem: string[] = [];

function getDocument() {
  return dataMem;
}

function deleteDocument() {
  dataMem = [];
}

function insertCharacter(content: string) {
  dataMem.push(content);
  // dataMem.sort((a, b) => a[a.length - 1].localeCompare(b[b.length - 1]))
}

function deleteCharacter(character: string) {
  dataMem = dataMem.filter(char => char.substring(0, char.length - 1) !== character.substring(0, character.length - 1));
}

export default {
  getDocument,
  insertCharacter,
  deleteCharacter,
  deleteDocument,
};
