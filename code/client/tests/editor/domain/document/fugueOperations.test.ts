import { describe, test, expect, beforeEach } from 'vitest';
import { Fugue } from '@domain/editor/crdt/fugue';
import {
  InsertOperation,
  DeleteOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';
import getFugueOperations from '@domain/editor/operations/fugue/operations';
import { FugueDomainOperations } from '@domain/editor/operations/fugue/types';
import { Document } from '@notespace/shared/workspace/types/document.ts';
import { Node, RootNode } from '@notespace/shared/crdt/types/nodes';
import { rootNode, treeNode } from '@notespace/shared/crdt/utils';

describe('Fugue Operations', () => {
  let fugue: Fugue;
  let fugueOperations: FugueDomainOperations;

  beforeEach(() => {
    fugue = new Fugue();
    fugueOperations = getFugueOperations(fugue);
  });

  test('should apply operations', () => {
    // given
    const insertOperation: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
    };

    // when
    fugueOperations.applyOperations([insertOperation]);

    // then
    expect(fugue.toString()).toEqual('a');

    // given
    const deleteOperation: DeleteOperation = {
      type: 'delete',
      id: { sender: 'A', counter: 0 },
    };

    // when
    fugueOperations.applyOperations([deleteOperation]);

    // then
    expect(fugue.toString()).toEqual('');

    // given
    const insertOperation2 = { ...insertOperation, id: { sender: 'A', counter: 1 }, value: 'b' };

    // when
    fugueOperations.applyOperations([insertOperation2]);

    // given
    const inlineStyleOperation: InlineStyleOperation = {
      type: 'inline-style',
      id: { sender: 'A', counter: 1 },
      style: 'bold',
      value: true,
    };

    // when
    fugueOperations.applyOperations([inlineStyleOperation]);

    // then
    expect(fugue.getNodeByCursor({ line: 0, column: 1 })?.styles).toEqual(['bold']);

    // given
    const blockStyleOperation: BlockStyleOperation = {
      type: 'block-style',
      style: 'paragraph',
      line: 0,
      append: false,
    };

    // when
    fugueOperations.applyOperations([blockStyleOperation]);

    // then
    expect(fugue.getBlockStyle(0)).toEqual('paragraph');
  });

  test('should initialize document', () => {
    // given
    const root: RootNode<string> = rootNode();
    const node1: Node<string> = treeNode({ sender: 'A', counter: 0 }, 'a', root.id, 'R', 1);
    const node2: Node<string> = treeNode({ sender: 'A', counter: 1 }, 'b', node1.id, 'R', 2);
    root.rightChildren = [node1.id];
    node1.rightChildren = [node2.id];
    const document: Document = {
      id: 'test',
      title: 'test',
      operations: [
        { type: 'insert', ...node1, parent: root.id, styles: [] },
        { type: 'insert', ...node2, parent: node1.id, styles: [] },
      ],
    };

    // when
    fugueOperations.applyOperations(document.operations);

    // then
    expect(fugue.toString()).toEqual('ab');
  });
});
