import { FugueTree } from '@notespace/shared/src/document/FugueTree.ts';
import { InsertOperation } from '@notespace/shared/src/document/types/operations.ts';
import { describe, test, expect, beforeEach } from 'vitest';
import { FugueNode } from '@domain/editor/crdt/types';
import { Node, Nodes } from '@notespace/shared/src/document/types/nodes.ts';

describe('FugueTree', () => {
  let tree: FugueTree<string>;
  beforeEach(() => {
    tree = new FugueTree();
  });

  test('should add a node to the tree', () => {
    // given
    const operation: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'L',
    };
    const rootId = { sender: 'root', counter: 0 };
    const { id, value, parent, side } = operation;

    // when
    tree.addNode(id, value, parent, side, []);

    // then
    const root = tree.getById(rootId);
    const node = tree.getById(id);
    expect(root.id).toEqual(rootId);
    expect(node.id).toEqual(id);
    expect(node.value).toEqual(value);
  });

  test('should delete a node from the tree', () => {
    // given
    const { id, value, parent, side }: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'L',
    };
    // when
    tree.addNode(id, value, parent, side);
    tree.deleteNode(id);

    // then
    const node = tree.getById(id);
    expect(node.isDeleted).toBeTruthy();
    expect(tree.toString()).toBe('');
  });

  test('should set the tree to the given nodes', () => {
    // given
    const nodes: Nodes<string> = {};
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
    nodes['root'] = [rootNode];
    nodes['A'] = [childNode];

    // when
    tree.setTree(nodes);

    // then
    expect(tree.getById({ sender: 'root', counter: 0 })).toEqual(rootNode);
    expect(tree.getById({ sender: 'A', counter: 0 })).toEqual(childNode);
  });

  test('should return the leftmost descendant of a node', () => {
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

  test('should traverse the tree in depth-first order', () => {
    // given
    tree.addNode({ sender: 'A', counter: 0 }, 'a', { sender: 'root', counter: 0 }, 'R');
    tree.addNode({ sender: 'A', counter: 1 }, 'b', { sender: 'A', counter: 0 }, 'R');
    tree.addNode({ sender: 'A', counter: 2 }, 'c', { sender: 'A', counter: 1 }, 'R');
    tree.addNode({ sender: 'A', counter: 3 }, 'd', { sender: 'A', counter: 2 }, 'R');

    // when
    const expectedValues = ['a', 'b', 'c', 'd'];
    const values: (string | Node<string>[])[] = [];
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

  test('should update the inline style of a node', () => {
    // given
    tree.addNode({ sender: 'A', counter: 0 }, 'a', { sender: 'root', counter: 0 }, 'R');

    // when
    tree.updateInlineStyle({ sender: 'A', counter: 0 }, 'bold', true);
    tree.updateInlineStyle({ sender: 'A', counter: 0 }, 'italic', true);

    // then
    const node = tree.getById({ sender: 'A', counter: 0 });
    expect(node.styles).toEqual(['bold', 'italic']);

    // when
    tree.updateInlineStyle({ sender: 'A', counter: 0 }, 'bold', false);

    // then
    expect(node.styles).toEqual(['italic']);
  });

  test('should update the block style of a line', () => {
    // when
    tree.updateBlockStyle('heading-one', 0);
    tree.updateBlockStyle('list-item', 1);

    // then
    expect(tree.root.styles).toEqual(['heading-one', 'list-item']);

    // when
    tree.updateBlockStyle('paragraph', 0);
    tree.updateBlockStyle('paragraph', 1);

    // then
    expect(tree.root.styles).toEqual(['paragraph', 'paragraph']);
  });
});
