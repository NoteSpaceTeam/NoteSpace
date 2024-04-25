import { describe, it, expect, beforeEach } from 'vitest';
import { Fugue } from '@editor/crdt/fugue';
import {
  InsertOperation,
  DeleteOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';
import getFugueOperations from '@editor/domain/document/fugue/operations';
import { FugueDomainOperations } from '@editor/domain/document/fugue/types.ts';
import { Document } from '@notespace/shared/crdt/types/document';
import { Node } from '@notespace/shared/crdt/types/nodes';
import { rootNode, treeNode } from '@notespace/shared/crdt/utils';

describe('Fugue Operations', () => {
  let fugue: Fugue;
  let fugueOperations: FugueDomainOperations;

  beforeEach(() => {
    fugue = new Fugue();
    fugueOperations = getFugueOperations(fugue);
  });

  it('should apply operations', () => {
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

  it('should initialize document', () => {
    // given
    const root: Node<string> = rootNode();
    const node1: Node<string> = treeNode({ sender: 'A', counter: 0 }, 'a', root.id, 'R', 1);
    const node2: Node<string> = treeNode({ sender: 'A', counter: 1 }, 'b', node1.id, 'R', 2);
    root.rightChildren = [node1.id];
    node1.rightChildren = [node2.id];
    const document: Document = {
      title: 'test',
      nodes: {
        root: [root],
        A: [node1, node2],
      },
    };

    // when
    fugueOperations.initDocument(document);

    // then
    expect(fugue.toString()).toEqual('ab');
  });
});
