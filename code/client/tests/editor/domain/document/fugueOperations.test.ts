import { describe, test, expect, beforeEach } from 'vitest';
import { Fugue } from '@domain/editor/fugue/Fugue';
import {
  InsertOperation,
  DeleteOperation,
  InlineStyleOperation,
  BlockStyleOperation,
  Operation,
} from '@notespace/shared/src/document/types/operations';
import { Node, RootNode } from '@domain/editor/fugue/nodes';
import { ServiceConnector } from '@domain/editor/connectors/service/connector';
import { DocumentContent } from '@notespace/shared/src/workspace/types/document';
import { rootNode, treeNode } from '@domain/editor/fugue/utils';

import serviceConnector from '@domain/editor/connectors/service/connector';
import { mockCommunication } from '@tests/mocks/mockCommunication';

describe('Fugue Operations', () => {
  let fugue: Fugue;
  const communication = mockCommunication();
  let _serviceConnector: ServiceConnector;
  let applyOperations: (operations: Operation[]) => void;

  beforeEach(() => {
    fugue = new Fugue();
    _serviceConnector = serviceConnector(fugue, communication);
    applyOperations = _serviceConnector.applyFugueOperations;
  });

  test('should apply operations', () => {
    // given
    const insertOperation: InsertOperation = {
      type: 'insert',
      id: { sender: 'A', counter: 0 },
      value: 'a',
      parent: { sender: 'root', counter: 0 },
      side: 'R',
      cursor: { line: 0, column: 0 },
    };

    // when
    applyOperations([insertOperation]);

    // then
    expect(fugue.toString()).toEqual('a');

    // given
    const deleteOperation: DeleteOperation = {
      type: 'delete',
      id: { sender: 'A', counter: 0 },
      cursor: { line: 0, column: 0 },
    };

    // when
    applyOperations([deleteOperation]);

    // then
    expect(fugue.toString()).toEqual('');

    // given
    const insertOperation2 = { ...insertOperation, id: { sender: 'A', counter: 1 }, value: 'b' };

    // when
    applyOperations([insertOperation2]);

    // given
    const inlineStyleOperation: InlineStyleOperation = {
      type: 'inline-style',
      id: { sender: 'A', counter: 1 },
      style: 'bold',
      value: true,
    };

    // when
    applyOperations([inlineStyleOperation]);

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
    applyOperations([blockStyleOperation]);

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
    const document: DocumentContent = {
      operations: [
        { type: 'insert', ...node1, parent: root.id, styles: [], cursor: { line: 0, column: 0 } },
        { type: 'insert', ...node2, parent: node1.id, styles: [], cursor: { line: 0, column: 1 } },
      ],
    };

    // when
    applyOperations(document.operations);

    // then
    expect(fugue.toString()).toEqual('ab');
  });
});
