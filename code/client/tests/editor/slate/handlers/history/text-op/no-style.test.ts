import { describe, it, expect, beforeEach } from 'vitest';
import { applyBatch, insertText, mockEditor, toBatch } from '@tests/editor/slate/handlers/history/utils';
import { toHistoryOperations } from '@/domain/editor/slate/handlers/history/utils';
import { Editor, BaseRemoveTextOperation, BaseInsertTextOperation } from 'slate';
import { last } from 'lodash';
import { InsertTextOperation, RemoveTextOperation } from '@/domain/editor/operations/history/types';
import { pointToCursor } from '@/domain/editor/slate/utils/selection';

let editor: Editor;

beforeEach(() => {
  editor = mockEditor();
});

describe('First line', () => {
  it('Should undo basic insert', () => {
    // Given a batch of insert operations
    const batch = toBatch(insertText('a', [0, 0], 0), insertText('b', [0, 0], 1), insertText('c', [0, 0], 2));

    // When we undo the last operation
    applyBatch(editor, batch);

    const editorBatch = last(editor.history.undos);
    expect(editorBatch).toBeDefined();

    const operations = toHistoryOperations(editor, editorBatch, true); // undo - true, redo - false

    // All operations should be 'delete' operations
    expect(operations.length).toBe(3);
    for (const i in operations) {
      const op = operations[i] as RemoveTextOperation;
      const editorOp = editorBatch!.operations[i] as BaseRemoveTextOperation;

      expect(op.type).toBe('remove_text');
      expect(op.selection).toEqual({
        start: pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset }),
        end: pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset + editorOp.text.length - 1 }),
      });
    }
  });

  it('Should redo basic insert', () => {
    // Given a batch of insert operations
    const batch = toBatch(insertText('a', [0, 0], 0), insertText('b', [0, 0], 1), insertText('c', [0, 0], 2));

    // When we undo the last operation
    applyBatch(editor, batch);

    editor.undo();

    const editorBatch = last(editor.history.redos);

    const operations = toHistoryOperations(editor, editorBatch, false); // undo - true, redo - false

    // All operations should be 'insert' operations
    expect(operations.length).toBe(3);
    for (const i in operations) {
      const op = operations[i] as InsertTextOperation;
      const editorOp = editorBatch!.operations[i] as BaseInsertTextOperation;
      expect(operations[i].type).toBe('insert_text');

      expect(op.cursor).toEqual(pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset }));
    }
  });
});

// describe("Other lines", () => {
// })
