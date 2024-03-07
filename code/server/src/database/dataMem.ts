import { Tree } from '../domain/crdt/tree';

const tree = new Tree();

function getTree(): TreeData<unknown> {
  return {
    root: tree.root,
    nodes: tree.nodes,
  };
}

function insertCharacter({ id, value, parent, side }: InsertMessage<unknown>): void {
  tree.addNode(id, value, parent, side);
}

function deleteCharacter({ id }: DeleteMessage): void {
  tree.deleteNode(id);
}

export default {
  getTree,
  insertCharacter,
  deleteCharacter,
};
