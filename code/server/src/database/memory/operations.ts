import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import { DeleteOperation, InsertOperation, StyleOperation } from '@notespace/shared/crdt/types/operations';
import { Nodes } from '@notespace/shared/crdt/types/nodes';

let tree = new FugueTree<string>();

async function getTree(): Promise<Nodes<string>> {
  return Object.fromEntries(Array.from(tree.nodes.entries()));
}

function deleteTree(): void {
  tree = new FugueTree();
}

function insertCharacter({ id, value, parent, side }: InsertOperation): void {
  tree.addNode(id, value, parent, side);
}

function deleteCharacter({ id }: DeleteOperation): void {
  tree.deleteNode(id);
}

function updateStyle({ id, style, value }: StyleOperation): void {
  tree.updateStyle(id, style, value);
}

export default {
  getTree,
  deleteTree,
  insertCharacter,
  deleteCharacter,
  updateStyle,
};