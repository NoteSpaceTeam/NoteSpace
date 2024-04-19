import { Fugue } from '@editor/crdt/fugue';
import {
  InsertOperation,
  DeleteOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';
import { Selection, Cursor } from '@notespace/shared/types/cursor';
import { describe, it, expect, beforeEach } from 'vitest';
import { FugueNode } from '@editor/crdt/types';

describe('Fugue', () => {
  let fugue: Fugue;

  beforeEach(() => {
    fugue = new Fugue();
  });

  it('should initialize properly', () => {
    expect(fugue).toBeDefined();
    expect(fugue.toString()).toEqual(expect.any(String));
  });

  it('should insert values locally', () => {
    // given
    const cursor: Cursor = { line: 0, column: 0 };

    // when
    const operations = fugue.insertLocal(cursor, 'a', 'b', 'c');

    // then
    expect(operations).toHaveLength(3);
    expect(operations.map(op => op.value).join('')).toEqual('abc');
    expect(fugue.toString()).toEqual('abc');
  });

  it('should insert values remotely', () => {
    // given
    const operation: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };

    // when
    fugue.insertRemote(operation);

    // then
    expect(fugue.toString()).toContain('a');
  });

  it('should delete values locally', () => {
    // given
    const cursor: Cursor = { line: 0, column: 0 };
    const selection: Selection = { start: { line: 0, column: 1 }, end: { line: 0, column: 3 } };

    // when
    fugue.insertLocal(cursor, 'a', 'b', 'c');
    const operations = fugue.deleteLocal(selection);

    // then
    expect(operations).toHaveLength(2);
    expect(operations.map(op => op.id.counter)).toEqual([1, 2]);
    expect(fugue.toString()).toEqual('a');
  });

  it('should delete values remotely', () => {
    // given
    const insertOperation: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'x',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };
    const deleteOperation: DeleteOperation = {
      type: 'delete',
      id: { sender: 'A', counter: 0 },
    };

    // when
    fugue.insertRemote(insertOperation);
    fugue.deleteRemote(deleteOperation);

    // then
    expect(fugue.toString()).toEqual('');
  });

  it('should update inline style of node locally', () => {
    // given
    const cursor: Cursor = { line: 0, column: 0 };
    const selection: Selection = { start: { line: 0, column: 0 }, end: { line: 0, column: 1 } };

    // when
    fugue.insertLocal(cursor, 'a');
    const operations = fugue.updateInlineStyleLocal(selection, 'bold');

    // then
    expect(operations).toHaveLength(1);
    expect(operations[0]).toEqual(expect.objectContaining({ type: 'inline-style', style: 'bold', value: true }));
    expect(fugue.getNodeByCursor({ line: 0, column: 1 })?.styles).toEqual(['bold']);
  });

  it('should update inline style of node remotely', () => {
    // given
    const id = { sender: 'A', counter: 0 };
    const insertOperation: InsertOperation = {
      type: 'insert',
      id,
      value: 'x',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };
    const styleOperation: InlineStyleOperation = {
      type: 'inline-style',
      id,
      style: 'bold',
      value: true,
    };

    // when
    fugue.insertRemote(insertOperation);
    fugue.updateInlineStyleRemote(styleOperation);

    // then
    expect(fugue.getNodeById(id).styles).toEqual(['bold']);
  });

  it('should update block style of node locally', () => {
    // when
    const operationHeading1 = fugue.updateBlockStyleLocal(0, 'heading-one');
    const operationListItem = fugue.updateBlockStyleLocal(1, 'list-item');

    // then
    expect(operationHeading1).toEqual(expect.objectContaining({ type: 'block-style', line: 0, style: 'heading-one' }));
    expect(operationListItem).toEqual(expect.objectContaining({ type: 'block-style', line: 1, style: 'list-item' }));
    expect(fugue.getBlockStyle(0)).toEqual('heading-one');
    expect(fugue.getBlockStyle(1)).toEqual('list-item');
  });

  it('should update block style of node remotely', () => {
    // given
    const operation: BlockStyleOperation = { type: 'block-style', line: 0, style: 'heading-one', append: false };

    // when
    fugue.updateBlockStyleRemote(operation);

    // then
    expect(fugue.getBlockStyle(0)).toEqual('heading-one');
  });

  it('should return the nodes in the given selection', () => {
    // given
    const cursor: Cursor = { line: 0, column: 0 };
    const selection: Selection = { start: { line: 0, column: 0 }, end: { line: 0, column: 1 } };

    // when
    fugue.insertLocal(cursor, 'a', 'b', 'c');
    const nodes = Array.from(fugue.traverseBySelection(selection));

    // then
    expect(nodes).toHaveLength(2);
    expect(nodes.map(node => node.value).join('')).toEqual('ab');
  });

  it('should return the nodes in the given selections', () => {
    const cursor: Cursor = { line: 0, column: 0 };
    const line1 = 'abcdef';
    const line2 = 'ghijkl';

    fugue.insertLocal(cursor, ...line1.split(''));
    fugue.insertLocal({ ...cursor, column: line1.length }, '\n');
    fugue.insertLocal({ ...cursor, column: 0, line: 1 }, ...line2.split(''));

    const selection1: Selection = { start: { line: 0, column: 1 }, end: { line: 0, column: 3 } };
    const selection2: Selection = { start: { line: 0, column: 3 }, end: { line: 0, column: 5 } };
    const selection3: Selection = { start: { line: 0, column: 3 }, end: { line: 1, column: 4 } };

    const nodes1 = Array.from(fugue.traverseBySelection(selection1));
    const nodes2 = Array.from(fugue.traverseBySelection(selection2));
    const nodes3 = Array.from(fugue.traverseBySelection(selection3));

    expect(nodes1.map(node => node.value).join('')).toEqual('bcd');
    expect(nodes2.map(node => node.value).join('')).toEqual('def');
    expect(nodes3.map(node => node.value).join('')).toEqual('def\nghij');
  });

  it('should return all nodes until the given separator', () => {
    // given
    const cursor: Cursor = { line: 0, column: 0 };

    // when
    fugue.insertLocal(cursor, '#', '#', '#', ' ', 'a');
    const nodes: FugueNode[] = fugue.traverseBySeparator(' ', cursor, false).next().value;

    // then
    expect(nodes).toHaveLength(3);
    expect(nodes.map(node => node.value).join('')).toEqual('###');

    // when
    const endCursor: Cursor = { line: 0, column: 5 };
    const reverseNodes: FugueNode[] = fugue.traverseBySeparator(' ', endCursor, true).next().value;

    // then
    expect(reverseNodes).toHaveLength(1);
    expect(reverseNodes[0].value).toEqual('a');
  });

  it('should delete a word by cursor', () => {
    // given
    const cursor: Cursor = { line: 0, column: 0 };
    fugue.insertLocal(cursor, 'a', 'b', 'c', ' ', 'd', 'e');

    // when
    const operations = fugue.deleteWordByCursor(cursor);

    // then
    expect(operations).toHaveLength(3);
    expect(fugue.toString()).toEqual(' de');

    // when
    const endCursor: Cursor = { line: 0, column: 5 };
    const reverseOperations = fugue.deleteWordByCursor(endCursor, true);

    // then
    expect(reverseOperations).toHaveLength(2);
    expect(fugue.toString()).toEqual(' ');
  });
});
