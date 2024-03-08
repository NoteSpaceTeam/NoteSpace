import { Tree } from '../domain/crdt/tree';

let tree = new Tree();

function getTree(): TreeData<unknown> {
  const root = tree.root;
  const nodes = Object.fromEntries(Array.from(tree.nodes.entries()));
  return { root, nodes };
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
