import { describe, test, expect, beforeEach } from 'vitest';
import { BaseRemoveTextOperation, Editor } from 'slate';
import { Fugue } from '@domain/editor/fugue/Fugue';
import {
  removeText,
  mockEditor,
  toBatch,
  applyBatch,
  getUndoOperations,
  getRedoOperations,
  removeNode,
} from '@tests/editor/slate/handlers/history/utils';
import { toSlate } from '@domain/editor/slate/utils/slate';
import { InsertTextOperation, RemoveTextOperation } from '@domain/editor/shared/historyTypes';
import { pointToCursor } from '@domain/editor/slate/utils/selection';
import { nodeInsert } from '@domain/editor/fugue/utils';

let editor: Editor;
let fugue: Fugue;

beforeEach(() => {
  editor = mockEditor();
  fugue = new Fugue();
});

describe('Single line', () => {
  describe('Single style', () => {
    const cutSingleLine = () => {
      fugue.insertLocal({ line: 0, column: 0 }, ...'abcdef'.split(''));
      editor.children = toSlate(fugue);

      const batch = toBatch(removeText('abcdef', [0, 0], 0));
      applyBatch(editor, batch);
    };

    beforeEach(cutSingleLine);

    test('Should undo cut', () => {
      const { operations } = getUndoOperations(editor, 1);

      const operation = operations[0] as InsertTextOperation;

      expect(operation.text).toStrictEqual('abcdef'.split(''));
      expect(operation.cursor).toEqual({ line: 0, column: 0 });
    });

    test('Should redo cut', () => {
      const { operations, editorBatch } = getRedoOperations(editor, 1);

      const operation = operations[0] as RemoveTextOperation;
      const editorOperation = editorBatch!.operations[0] as BaseRemoveTextOperation;

      expect(operation.selection).toEqual({
        start: pointToCursor(editor, { path: editorOperation.path, offset: 0 }),
        end: pointToCursor(editor, {
          path: editorOperation.path,
          offset: editorOperation.offset + editorOperation.text.length - 1,
        }),
      });
    });
  });

  describe('Multiple styles', () => {
    const cutMultipleStyles = () => {
      fugue.insertLocal({ line: 0, column: 0 }, ...'abc'.split(''));
      fugue.insertLocal({ line: 0, column: 3 }, nodeInsert('text', ['bold']), nodeInsert('text', ['italic']));
      editor.children = toSlate(fugue);

      const batch = toBatch(
        removeText('abc', [0, 0], 0),
        removeText('text', [0, 1], 0),
        removeNode({ text: '' }, [0, 1]),
        removeText('text', [0, 2], 0),
        removeNode({ text: '' }, [0, 2])
      );
      editor.history.undos = [batch];
    };

    beforeEach(cutMultipleStyles);

    test('Should undo cut', () => {
      const { operations, editorBatch } = getUndoOperations(editor, 3); // remove node op. with empty text are ignored

      const editorOperations = editorBatch!.operations.filter(
        op => op.type === 'remove_text'
      ) as BaseRemoveTextOperation[];

      for (const i in operations) {
        const operation = operations[i] as InsertTextOperation;
        const editorOperation = editorOperations[i];

        expect(operation.text).toStrictEqual(editorOperation.text.split(''));
        expect(operation.cursor).toEqual(
          pointToCursor(editor, { path: editorOperation.path, offset: editorOperation.offset })
        );
      }
    });

    test('Should redo cut', () => {
      const { operations, editorBatch } = getRedoOperations(editor, 3);

      const editorOperations = editorBatch!.operations.filter(
        op => op.type === 'remove_text'
      ) as BaseRemoveTextOperation[];

      for (const i in operations) {
        const operation = operations[i] as RemoveTextOperation;
        const editorOperation = editorOperations[i];

        expect(operation.selection).toEqual({
          start: pointToCursor(editor, { path: editorOperation.path, offset: editorOperation.offset }),
          end: pointToCursor(editor, {
            path: editorOperation.path,
            offset: editorOperation.offset + editorOperation.text.length - 1,
          }),
        });
      }
    });
  });
});

// describe('Multiple lines', () => {
//
//
// });
