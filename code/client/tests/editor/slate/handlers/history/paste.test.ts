import { describe, test, expect, beforeEach } from 'vitest';
import { BaseInsertTextOperation, Editor } from 'slate';
import { Fugue } from '@domain/editor/fugue/Fugue';
import {
  applyBatch,
  getRedoOperations,
  getUndoOperations,
  insertText,
  mockEditor,
  toBatch,
} from '@tests/editor/slate/handlers/history/utils';
import { toSlate } from '@domain/editor/slate/utils/slate';
import { InsertTextOperation, RemoveTextOperation } from '@domain/editor/operations/history/types';
import { pointToCursor } from '@domain/editor/slate/utils/selection';

let editor: Editor;
let fugue: Fugue;

beforeEach(() => {
  editor = mockEditor();
  fugue = new Fugue();
});

describe('Single line', () => {
  describe('Single style', () => {
    const pasteSingleLine = () => {
      fugue.insertLocal({ line: 0, column: 0 }, ...'abcdef'.split(''));
      editor.children = toSlate(fugue);

      const batch = toBatch(insertText('abcdef', [0, 0], 0));
      applyBatch(editor, batch);
    };

    beforeEach(pasteSingleLine);

    test('Should undo paste', () => {
      const { operations, editorBatch } = getUndoOperations(editor, 1);

      const operation = operations[0] as RemoveTextOperation;
      const editorOperation = editorBatch?.operations[0] as BaseInsertTextOperation;

      expect(operation.selection).toEqual({
        start: pointToCursor(editor, { path: editorOperation.path, offset: 0 }),
        end: pointToCursor(editor, {
          path: editorOperation.path,
          offset: editorOperation.offset + editorOperation.text.length - 1,
        }),
      });
    });

    test('Should redo paste', () => {
      const { operations, editorBatch } = getRedoOperations(editor, 1);

      const operation = operations[0] as InsertTextOperation;
      const editorOperation = editorBatch!.operations[0] as BaseInsertTextOperation;

      expect(operation.cursor).toEqual(pointToCursor(editor, { path: editorOperation.path, offset: 0 }));
    });
  });

  // describe('Multiple styles', () => {
  //
  // });
});

// describe('Multi line', () => {
//
// });
