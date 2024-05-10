import { describe, test, beforeEach, expect } from 'vitest';
import {
  applyBatch,
  getRedoOperations,
  getUndoOperations,
  insertNode,
  insertText,
  mockEditor,
  setNode,
  toBatch,
} from './utils';
import { Fugue } from '@domain/editor/crdt/fugue';
import { toSlate } from '@domain/editor/slate/utils/slate';
import {
  InsertNodeOperation,
  InsertTextOperation,
  RemoveNodeOperation,
  RemoveTextOperation,
  SetNodeOperation,
  UnsetNodeOperation,
} from '@domain/editor/operations/history/types';
import {
  BaseInsertNodeOperation,
  BaseInsertTextOperation,
  BaseRemoveTextOperation,
  BaseSetNodeOperation,
  Editor,
  Element,
  Text,
} from 'slate';
import { pointToCursor } from '@domain/editor/slate/utils/selection';
import { BlockStyles } from '@notespace/shared/document/types/styles';

let editor: Editor;
let fugue: Fugue;

beforeEach(() => {
  editor = mockEditor();
  fugue = new Fugue();
});

describe('No style', () => {
  const insertAtEmpty = () => {
    fugue.insertLocal({ line: 0, column: 0 }, '');
    editor.children = toSlate(fugue);
    const batch = toBatch(insertText('a', [0, 0], 0), insertText('b', [0, 0], 1), insertText('c', [0, 0], 2));
    applyBatch(editor, batch);
  };

  beforeEach(insertAtEmpty);

  test('Should undo insert', () => {
    const { operations, editorBatch } = getUndoOperations(editor, 3);
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

  test('Should redo insert', () => {
    const { operations, editorBatch } = getRedoOperations(editor, 3);
    for (const i in operations) {
      const op = operations[i] as InsertTextOperation;
      const editorOp = editorBatch!.operations[i] as BaseInsertTextOperation;
      expect(operations[i].type).toBe('insert_text');
      expect(op.cursor).toEqual(pointToCursor(editor, { path: editorOp.path, offset: editorOp.offset }));
    }
  });
});

describe('Block style', () => {
  const insertBlockAtEmpty = () => {
    fugue.insertLocal({ line: 0, column: 0 }, '');
    editor.children = toSlate(fugue);
    const batch = toBatch(setNode({ type: BlockStyles.p }, { type: BlockStyles.h1 }, [0]));
    editor.history.undos = [batch];
  };

  beforeEach(insertBlockAtEmpty);

  test('Should undo insert block', () => {
    const { operations, editorBatch } = getUndoOperations(editor, 1);

    const op = operations[0] as UnsetNodeOperation;
    const editorOp = editorBatch!.operations[0] as BaseSetNodeOperation;
    expect(operations[0].type).toBe('unset_node');
    expect(op.properties).toBe(editorOp.newProperties);
  });

  test('Should redo insert block', () => {
    const { operations } = getRedoOperations(editor, 1);

    const op = operations[0] as SetNodeOperation;
    const editorOp = editor.history!.redos[0].operations[0] as BaseSetNodeOperation;
    expect(operations[0].type).toBe('set_node');

    const props = op.properties as Element;
    const newProps = editorOp.properties as Element;
    expect(props.type).toBe(newProps.type);
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

    test('Should undo insert text', () => {
      const { operations, editorBatch } = getUndoOperations(editor, 3);

      const nodeInsertOp = operations[0] as RemoveNodeOperation;
      const editorNodeOp = editorBatch!.operations[0] as BaseInsertNodeOperation;
      expect(Text.isText(nodeInsertOp.node) && Text.isText(editorNodeOp.node)).toBe(true);

      const nodeText = nodeInsertOp.node as Text;
      const editorText = editorNodeOp.node as Text;

      expect(nodeText.text).toBe(editorText.text);
      expect(nodeText.bold).toBe(editorText.bold);
      expect(nodeInsertOp.selection).toEqual({
        start: pointToCursor(editor, { path: editorNodeOp.path, offset: 0 }),
        end: pointToCursor(editor, { path: editorNodeOp.path, offset: editorText.text.length - 1 }),
      });
    });

    test('Should redo insert text', () => {
      const { operations, editorBatch } = getRedoOperations(editor, 3);

      const nodeInsertOp = operations[0] as InsertNodeOperation;
      const editorNodeOp = editorBatch!.operations[0] as BaseInsertNodeOperation;

      expect(Text.isText(nodeInsertOp.node) && Text.isText(editorNodeOp.node)).toBe(true);

      const nodeText = nodeInsertOp.node as Text;
      const editorText = editorNodeOp.node as Text;

      expect(nodeText.text).toBe(editorText.text);
      expect(nodeText.bold).toBe(editorText.bold);
    });
  });
});
