import { Tree } from 'shared/crdt/tree';
import { DeleteMessage, InsertMessage } from 'shared/crdt/types';

let tree = new Tree();

async function getTree() {
  return Object.fromEntries(Array.from(tree.nodes.entries()));
}

function deleteTree(): void {
  tree = new Tree();
}

function insertCharacter({ id, value, parent, side }: InsertMessage<unknown>): void {
  tree.addNode(id, value, parent, side);
}

function deleteCharacter({ id }: DeleteMessage): void {
  tree.deleteNode(id);
}

export default {
  getTree,
  deleteTree,
  insertCharacter,
  deleteCharacter,
};
