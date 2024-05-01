import { describe, it, beforeEach, expect } from 'vitest';
import { applyBatch, insertNode, insertText, mockEditor, toBatch } from '@tests/editor/slate/handlers/history/utils';
import { Fugue } from '@domain/editor/crdt/fugue';
import { toSlate } from '@domain/editor/slate/utils/slate';
import { last } from 'lodash';
import { toHistoryOperations } from '@domain/editor/slate/handlers/history/utils';
import { InsertNodeOperation, InsertTextOperation, RemoveTextOperation } from '@domain/editor/operations/history/types';
import { BaseInsertNodeOperation, BaseInsertTextOperation, BaseRemoveTextOperation, Editor } from 'slate';
import { pointToCursor } from '@domain/editor/slate/utils/selection';

let editor: Editor;
let fugue: Fugue;

beforeEach(() => {
  editor = mockEditor();
  fugue = new Fugue();
});

describe('No style & Block style', () => {
  const insertAtEmpty = () => {
    fugue.insertLocal({ line: 0, column: 0 }, '');
    editor.children = toSlate(fugue);
    const batch = toBatch(insertText('a', [0, 0], 0), insertText('b', [0, 0], 1), insertText('c', [0, 0], 2));
    applyBatch(editor, batch);
  };

  beforeEach(insertAtEmpty);

  it('Should undo insert', () => {
    const { operations, editorBatch } = getUndoOperations();
    for (const i in operations) {
      const op = operations[i] as RemoveTextOperation;
      const editorOp = editorBatch!.operations[i] as BaseRemoveTextOperation;
      expect(operations[i].type).toBe('remove_text');

      expect(op.selection).toEqual({
        start: pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset }),
        end: pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset }),
      });
    }
  });

  it('Should redo insert', () => {
    const { operations, editorBatch } = getRedoOperations();
    for (const i in operations) {
      const op = operations[i] as InsertTextOperation;
      const editorOp = editorBatch!.operations[i] as BaseInsertTextOperation;
      expect(operations[i].type).toBe('insert_text');
      expect(op.cursor).toEqual(pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset }));
    }
  });
});

describe('Inline style', () => {
  describe('Empty line', () => {
    const insertInlineAtEmpty = () => {
      fugue.insertLocal({ line: 0, column: 0 }, '');
      editor.children = toSlate(fugue);
      const batch = toBatch(
        insertNode({ text: 'a', bold: true }, [0, 0]),
        insertText('b', [0, 0], 1),
        insertText('c', [0, 0], 2)
      );
      applyBatch(editor, batch);
    };

    beforeEach(insertInlineAtEmpty);

    it('Should undo insert text', () => {
      const editorBatch = last(editor.history.undos);
      const operations = toHistoryOperations(editor, editorBatch, true); // undo - true, redo - false
      expect(operations.length).toBe(3);

      const nodeInsertOp = operations[0] as InsertNodeOperation;
      const editorNodeOp = editorBatch!.operations[0] as BaseInsertNodeOperation;

      expect(nodeInsertOp.node.text).toBe(editorNodeOp.node.text);
      expect(nodeInsertOp.node.bold).toBe(editorNodeOp.node.bold);
      expect(nodeInsertOp.selection).toEqual({
        start: pointToCursor(editor, { path: editorNodeOp.path, offset: 0 }),
        end: pointToCursor(editor, { path: editorNodeOp.path, offset: 0 + editorNodeOp.node.text.length - 1 }),
      });
    });
    it('Should redo insert text', () => {
      const editorBatch = last(editor.history.undos);
      editor.undo();
      const operations = toHistoryOperations(editor, editorBatch, false); // undo - true, redo - false
      expect(operations.length).toBe(3);

      const nodeInsertOp = operations[0] as InsertNodeOperation;
      const editorNodeOp = editorBatch!.operations[0] as BaseInsertNodeOperation;

      expect(nodeInsertOp.node.text).toBe(editorNodeOp.node.text);
      expect(nodeInsertOp.node.bold).toBe(editorNodeOp.node.bold);
    });
  });
});

function getUndoOperations() {
  const editorBatch = last(editor.history.undos);

  // Then
  expect(editorBatch).toBeDefined();

  // When
  const operations = toHistoryOperations(editor, editorBatch, true); // undo - true, redo - false

  // Then
  expect(operations.length).toBe(3);
  return { operations, editorBatch };
}

function getRedoOperations() {
  editor.undo();

  const editorBatch = last(editor.history.redos);
  const operations = toHistoryOperations(editor, editorBatch, false); // undo - true, redo - false

  // Then
  expect(operations.length).toBe(3);
  return { operations, editorBatch };
}
