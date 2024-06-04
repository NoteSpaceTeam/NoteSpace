import { describe, beforeEach, expect, test } from 'vitest';
import { BaseInsertTextOperation, BaseSetNodeOperation, Editor } from 'slate';
import { Fugue } from '@domain/editor/fugue/Fugue';
import {
  applyBatch,
  removeText,
  getRedoOperations,
  getUndoOperations,
  mockEditor,
  removeNode,
  setNode,
  toBatch,
} from '@tests/editor/slate/operations/history/utils';
import { toSlate } from '@domain/editor/slate/utils/slate';
import {
  InsertTextOperation,
  RemoveTextOperation,
  SetNodeOperation,
  UnsetNodeOperation,
} from '@domain/editor/fugue/operations/history/types';
import { pointToCursor } from '@domain/editor/slate/utils/selection';
import { BlockStyles } from '@notespace/shared/src/document/types/styles';

let editor: Editor;
let fugue: Fugue;

beforeEach(() => {
  editor = mockEditor();
  fugue = new Fugue();
});

describe('No style', () => {
  const setup = () => {
    fugue.insertLocal({ line: 0, column: 0 }, ...'abc'.split(''));
    editor.children = toSlate(fugue);

    const batch = toBatch(removeText('a', [0, 0], 0));

    applyBatch(editor, batch);
  };

  beforeEach(setup);

  test('should undo delete', () => {
    const { operations, editorBatch } = getUndoOperations(editor, 1);
    for (const i in operations) {
      const op = operations[i] as InsertTextOperation;
      const editorOp = editorBatch!.operations[i] as BaseInsertTextOperation;
      expect(op.type).toBe('insert_text');

      expect(op.cursor).toEqual(pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset }));
    }
  });

  test('should redo delete', () => {
    const { operations } = getRedoOperations(editor, 1);
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

describe('Block Style', () => {
  const deleteBlock = () => {
    fugue.insertLocal({ line: 0, column: 0 }, 'abc');
    editor.children = toSlate(fugue);

    const batch = toBatch(setNode({ type: BlockStyles.h1 }, { type: BlockStyles.p }, [0]));
    applyBatch(editor, batch);
  };

  beforeEach(deleteBlock);

  test('should undo remove block style', () => {
    const { operations, editorBatch } = getUndoOperations(editor, 1);
    const op = operations[0] as UnsetNodeOperation;
    const editorOp = editorBatch!.operations[0] as BaseSetNodeOperation;

    expect(op.selection).toEqual({
      start: pointToCursor(editor, { path: editorOp.path, offset: 0 }),
      end: pointToCursor(editor, { path: editorOp.path, offset: 0 }),
    });
  });

  test('should redo remove block style', () => {
    const { operations } = getRedoOperations(editor, 1);
    for (const i in operations) {
      const op = operations[i] as SetNodeOperation;
      const editorOp = editor.history!.redos[0].operations[i] as BaseSetNodeOperation;
      expect(operations[i].type).toBe('set_node');

      expect(op.selection).toEqual({
        start: pointToCursor(editor, { path: editorOp.path, offset: 0 }),
        end: pointToCursor(editor, { path: editorOp.path, offset: 0 }),
      });
    }
  });
});

describe('Inline Style', () => {
  const deleteInline = () => {
    fugue.insertLocal({ line: 0, column: 0 }, 'a');
    editor.children = toSlate(fugue);

    const batch = toBatch(removeText('b', [0, 1], 0), removeNode({ text: '', bold: true }, [0, 1]));
    editor.history.undos = [batch];
  };

  beforeEach(deleteInline);

  test('should undo remove inline style', () => {
    const { operations, editorBatch } = getUndoOperations(editor, 1); // remove node op. with empty text
    const op = operations[0] as InsertTextOperation;
    const editorOp = editorBatch!.operations[0] as BaseInsertTextOperation;

    expect(op.cursor).toEqual(pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset }));
  });

  test('should redo remove inline style', () => {
    const { operations } = getRedoOperations(editor, 1);

    const op = operations[0] as RemoveTextOperation;
    const editorOp = editor.history!.redos[0].operations[0] as BaseInsertTextOperation;

    expect(op.selection).toEqual({
      start: pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset }),
      end: pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset + editorOp.text.length - 1 }),
    });
  });
});
