let dataMem: string[] = [];

function getDocument() {
  console.log(dataMem);
  return dataMem;
}

function deleteDocument() {
  dataMem = [];
}

function insertCharacter(data: string[]) {
  dataMem = dataMem.concat(data);
  // dataMem.sort((a, b) => a[a.length - 1].localeCompare(b[b.length - 1]))
}

function deleteCharacter(data: string[]) {
  //dataMem = dataMem.filter(char => char.substring(0, char.length - 1) !== character.substring(0, character.length - 1));
}

export default {
  getDocument,
  insertCharacter,
  deleteCharacter,
  deleteDocument,
};
