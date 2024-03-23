import { InsertOperation, DeleteOperation, StyleOperation } from '@notespace/shared/crdt/types/operations';
import { getTreeInstance, setDocument, updateTree } from '@src/database/firestore/firestore';

async function getTree() {
  const tree = await getTreeInstance();
  return Object.fromEntries(tree.nodes);
}

async function deleteTree() {
  await setDocument({});
}

async function insertCharacter({ id, value, parent, side }: InsertOperation) {
  await updateTree(tree => {
    tree.addNode(id, value, parent, side);
  });
}

async function deleteCharacter({ id }: DeleteOperation) {
  await updateTree(tree => {
    tree.deleteNode(id);
  });
}

async function updateStyle({ id, style, value }: StyleOperation) {
  await updateTree(tree => {
    tree.updateStyle(id, style, value);
  });
}

export default {
  getTree,
  deleteTree,
  insertCharacter,
  deleteCharacter,
  updateStyle,
};
