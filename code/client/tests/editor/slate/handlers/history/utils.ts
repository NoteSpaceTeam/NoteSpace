import { withHistory } from 'slate-history';
import {
  BaseOperation,
  Editor,
  InsertNodeOperation,
  InsertTextOperation,
  MergeNodeOperation,
  Node,
  Path,
  RemoveNodeOperation,
  RemoveTextOperation,
  SetNodeOperation,
  SplitNodeOperation,
} from 'slate';
import { Batch, toHistoryOperations } from '@domain/editor/slate/handlers/history/toHistoryOperations';
import { buildEditor } from '@/domain/editor/slate/utils/slate';
import { withReact } from 'slate-react';
import { last } from 'lodash';
import { expect } from 'vitest';

export const mockEditor = () => {
  return buildEditor(withReact, withHistory);
};

export const applyBatch = (editor: any, batch: Batch) => {
  for (const operation of batch.operations) {
    editor.apply(operation);
  }
};

export const toBatch = (...operations: BaseOperation[]): Batch => {
  return {
    operations: operations,
    selectionBefore: null,
  };
};

export const insertText = (text: string, path: Path, offset: number): InsertTextOperation => {
  return { type: 'insert_text', path, offset, text };
};

export const deleteText = (text: string, path: Path, offset: number): RemoveTextOperation => ({
  type: 'remove_text',
  path,
  offset,
  text,
});

export const insertNode = (node: Node, path: Path): InsertNodeOperation => ({ type: 'insert_node', path, node });

export const removeNode = (node: Node, path: Path): RemoveNodeOperation => ({ type: 'remove_node', node, path });

export const splitNode = (properties: Partial<Node>, path: Path, position: number): SplitNodeOperation => ({
  type: 'split_node',
  path,
  properties,
  position,
});

export const mergeNode = (properties: Partial<Node>, path: Path, position: number): MergeNodeOperation => ({
  type: 'merge_node',
  path,
  properties,
  position,
});

export const setNode = (properties: Partial<Node>, newProperties: Partial<Node>, path: Path): SetNodeOperation => ({
  type: 'set_node',
  path,
  properties,
  newProperties,
});

export function getUndoOperations(editor: Editor, n: number) {
  const editorBatch = last(editor.history.undos);

  // Then
  expect(editorBatch).toBeDefined();

  // When
  const operations = toHistoryOperations(editor, editorBatch, true); // undo - true, redo - false

  // Then
  expect(operations.length).toBe(n);
  return { operations, editorBatch };
}

export function getRedoOperations(editor: Editor, n: number) {
  editor.undo();

  const editorBatch = last(editor.history.redos);
  const operations = toHistoryOperations(editor, editorBatch, false); // undo - true, redo - false

  // Then
  expect(operations.length).toBe(n);
  return { operations, editorBatch };
}
