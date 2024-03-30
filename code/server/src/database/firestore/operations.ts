import {
  InsertOperation,
  DeleteOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';
import { getTreeInstance, setDocument, updateTree } from '@database/firestore/firestore';

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

async function updateInlineStyle({ id, style, value }: InlineStyleOperation) {
  await updateTree(tree => {
    tree.updateInlineStyle(id, style, value);
  });
}

async function updateBlockStyle({ style, line }: BlockStyleOperation) {
  await updateTree(tree => {
    tree.updateBlockStyle(style, line);
  });
}

export default {
  getTree,
  deleteTree,
  insertCharacter,
  deleteCharacter,
  updateInlineStyle,
  updateBlockStyle,
};
