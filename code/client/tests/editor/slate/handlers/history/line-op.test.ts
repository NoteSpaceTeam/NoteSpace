import {describe, test, expect, beforeEach} from "vitest";
import {BaseMergeNodeOperation, BaseSplitNodeOperation, Editor} from "slate";
import {Fugue} from "@domain/editor/crdt/fugue";
import {
    getRedoOperations,
    getUndoOperations,
    mockEditor,
    splitNode,
    toBatch
} from "@tests/editor/slate/handlers/history/utils";
import {toSlate} from "@domain/editor/slate/utils/slate";
import {BlockStyles} from "@notespace/shared/types/styles";
import {MergeNodeOperation, SplitNodeOperation} from "@domain/editor/operations/history/types";
import {pointToCursor} from "@domain/editor/slate/utils/selection";

let editor : Editor
let fugue : Fugue

beforeEach(() => {
    editor = mockEditor();
    fugue = new Fugue();
});

describe('Insert line', () => {

    const insertLine = () => {
        // when
        fugue.insertLocal({ line: 0, column: 0 }, ...'abcdef'.split(''));
        fugue.insertLocal({ line: 0, column: 6 }, '\n');
        editor.children = toSlate(fugue);
        const batch = toBatch(
            splitNode({}, [0, 0], 0),
            splitNode({type: BlockStyles.p}, [0], 1)
        );
        batch.selectionBefore = {anchor: {path: [0, 0], offset: 6}, focus: {path:[0, 0], offset: 6}};
        editor.history.undos = [batch];
    }

    beforeEach(insertLine);

    test('Should undo paste', () => {
        const {operations, editorBatch } = getUndoOperations(editor, 1);

        const operation = operations[0] as MergeNodeOperation
        const editorOperation = editorBatch?.operations[1] as BaseMergeNodeOperation;

        expect(operation.cursor).toEqual(
            pointToCursor(editor, {path: [editorOperation.path[0] + 1, 0], offset: 0})
        );

    });

    test('Should redo paste', () => {
        const {operations, editorBatch } = getRedoOperations(editor, 1);

        const operation = operations[0] as SplitNodeOperation;
        const editorOperation = editorBatch?.operations[1] as BaseSplitNodeOperation;

        expect(operation.cursor).toEqual(
            pointToCursor(editor, {path: editorOperation.path, offset: editorBatch?.selectionBefore!.anchor.offset || 0})
        );
    });

});

describe('Delete Line', () => {
   test('Should undo delete', () => {

   });
   test('Should redo delete', () => {

   });
});