import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import { DeleteMessage, InsertMessage } from '@notespace/shared/crdt/types';

let tree = new FugueTree();

async function getTree() {
  return Object.fromEntries(Array.from(tree.nodes.entries()));
}

function deleteTree(): void {
  tree = new FugueTree();
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
