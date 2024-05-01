import { describe, it, beforeEach, expect } from 'vitest';
import { BaseInsertTextOperation, Editor } from 'slate';
import { Fugue } from '@domain/editor/crdt/fugue';
import { applyBatch, deleteText, mockEditor, toBatch } from '@tests/editor/slate/handlers/history/utils';
import { toSlate } from '@domain/editor/slate/utils/slate';
import { toHistoryOperations } from '@domain/editor/slate/handlers/history/utils';
import { last } from 'lodash';
import { InsertTextOperation, RemoveTextOperation } from '@domain/editor/operations/history/types';
import { pointToCursor } from '@domain/editor/slate/utils/selection';

let editor: Editor;
let fugue: Fugue;

beforeEach(() => {
  editor = mockEditor();
  fugue = new Fugue();
});

describe('No style & Block Style', () => {
  const setup = () => {
    fugue.insertLocal({ line: 0, column: 0 }, ...'abc'.split(''));
    editor.children = toSlate(fugue);

    const batch = toBatch(deleteText('a', [0, 0], 0));

    applyBatch(editor, batch);
  };

  beforeEach(setup);
  it('should undo delete', () => {
    const { operations, editorBatch } = getUndoOperations();
    for (const i in operations) {
      const op = operations[i] as InsertTextOperation;
      const editorOp = editorBatch!.operations[i] as BaseInsertTextOperation;
      expect(op.type).toBe('insert_text');

      expect(op.cursor).toEqual(pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset }));
    }
  });
  it('should redo delete', () => {
    const { operations } = getRedoOperations();
    for (const i in operations) {
      const op = operations[i] as RemoveTextOperation;
      const editorOp = editor.history!.redos[0].operations[i] as BaseInsertTextOperation;
      expect(operations[i].type).toBe('remove_text');

      expect(op.selection).toEqual({
        start: pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset }),
        end: pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset + editorOp.text.length - 1 }),
      });
    }
  });
});

function getUndoOperations() {
  const editorBatch = last(editor.history!.undos);
  return {
    operations: toHistoryOperations(editor, editorBatch, true),
    editorBatch,
  };
}

function getRedoOperations() {
  editor.undo();
  const editorBatch = last(editor.history!.redos);
  return {
    operations: toHistoryOperations(editor, editorBatch, false),
    editorBatch,
  };
}
