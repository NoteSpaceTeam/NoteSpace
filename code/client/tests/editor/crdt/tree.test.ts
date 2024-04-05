import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import { InsertOperation } from '@notespace/shared/crdt/types/operations';
import { describe, it, expect, beforeEach } from 'vitest';
import { FugueNode } from '../../../src/editor/crdt/types';

describe('Tree', () => {
  let tree: FugueTree<string>;
  beforeEach(() => {
    tree = new FugueTree();
  });

  it('should add a node to the tree', () => {
    // given
    const insertMessage: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'L',
    };
    const rootId = { sender: 'root', counter: 0 };
    const { id, value, parent, side } = insertMessage;

    // when
    tree.addNode(id, value, parent, side);

    // then
    const root = tree.getById(rootId);
    const node = tree.getById(id);
    expect(root.id).toEqual(rootId);
    expect(node.id).toEqual(id);
    expect(node.value).toEqual(value);
  });

  it('should delete a node from the tree', () => {
    // given
    const insertMessage: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'L',
    };
    const { id, value, parent, side } = insertMessage;

    // when
    tree.addNode(id, value, parent, side);
    tree.deleteNode(id);

    // then
    const node = tree.getById(id);
    expect(node.isDeleted).toBeTruthy();
    expect(tree.toString()).toBe('');
  });

  it('should set the tree to the given nodes', () => {
    // given
    const nodesMap = new Map<string, FugueNode[]>();
    const rootNode: FugueNode = tree.root;
    const childNode: FugueNode = {
      id: { sender: 'A', counter: 0 },
      value: 'a',
      isDeleted: false,
      parent: { sender: 'root', counter: 0 },
      side: 'L',
      leftChildren: [],
      rightChildren: [],
      depth: 1,
      styles: [],
    };
    nodesMap.set('root', [rootNode]);
    nodesMap.set('A', [childNode]);

    // when
    tree.setTree(nodesMap);

    // then
    expect(tree.getById({ sender: 'root', counter: 0 })).toEqual(rootNode);
    expect(tree.getById({ sender: 'A', counter: 0 })).toEqual(childNode);
  });

  it('should traverse the tree by index and return the correct node', () => {
    // given
    tree.addNode({ sender: 'A', counter: 0 }, 'a', { sender: 'root', counter: 0 }, 'L');
    tree.addNode({ sender: 'A', counter: 1 }, 'b', { sender: 'root', counter: 0 }, 'R');
    tree.addNode({ sender: 'A', counter: 2 }, 'c', { sender: 'A', counter: 0 }, 'L');

    // when
    const node = tree.getByIndex(tree.root, 2);

    // then
    expect(node).toEqual(tree.getById({ sender: 'A', counter: 1 }));
  });

  it('should return the leftmost descendant of a node', () => {
    // given
    tree.addNode({ sender: 'A', counter: 0 }, 'a', { sender: 'root', counter: 0 }, 'L');
    tree.addNode({ sender: 'A', counter: 1 }, 'b', { sender: 'A', counter: 0 }, 'L');
    tree.addNode({ sender: 'A', counter: 2 }, 'c', { sender: 'A', counter: 1 }, 'L');

    // when
    const leftmostDescendant = tree.getLeftmostDescendant({
      sender: 'root',
      counter: 0,
    });

    // then
    expect(leftmostDescendant.id.counter).toEqual(2);
  });

  it('should traverse the tree in depth-first order', () => {
    // given
    tree.addNode({ sender: 'A', counter: 0 }, 'a', { sender: 'root', counter: 0 }, 'R');
    tree.addNode({ sender: 'A', counter: 1 }, 'b', { sender: 'A', counter: 0 }, 'R');
    tree.addNode({ sender: 'A', counter: 2 }, 'c', { sender: 'A', counter: 1 }, 'R');
    tree.addNode({ sender: 'A', counter: 3 }, 'd', { sender: 'A', counter: 2 }, 'R');

    // when
    const expectedValues = ['a', 'b', 'c', 'd'];
    const values: string[] = [];
    const iterator = tree.traverse(tree.root);
    let result = iterator.next();
    while (!result.done) {
      values.push(result.value.value!);
      result = iterator.next();
    }

    // then
    expect(values).toEqual(expectedValues);
    expect(values.join('')).toEqual(tree.toString());
  });
});
