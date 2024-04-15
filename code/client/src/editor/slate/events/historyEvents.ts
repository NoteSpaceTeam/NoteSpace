import { Editor } from 'slate';
import { Operation as SlateOperation } from 'slate';
import { Fugue } from '@editor/crdt/Fugue';
import { getSelectionBySlate } from '@editor/slate/utils/selection';
import { last } from 'lodash';
import { Communication } from '@socket/communication';

export type HistoryOperations = {
  undo: () => void;
  redo: () => void;
};

/**
 * Handles undo and redo operations
 * @param editor
 * @param fugue
 * @param communication
 */
function historyEvents(editor: Editor, fugue: Fugue, communication: Communication): HistoryOperations {
  function undo() {
    const { history } = editor;
    const undo = last(history.undos);
    if (undo) {
      undo.operations.map(reverseOperation);
    }
  }
  function redo() {
    const { history } = editor;
    const redo = last(history.redos);
    if (redo) {
      redo.operations.map(reverseOperation);
    }
  }

  function reverseInsertText(operations: BaseInsertTextOperation[]): Operation[] {
    const path = last(operations)!.path[0] - operations[0].path[0];
    const offset = last(operations)!.offset - operations[0].offset;
    const length = operations.map(operation => operation.text).length;
    const selection = {
      start: {
        line: path,
        column: offset - length + 1,
      },
      end: {
        line: path,
        column: offset + 1,
      },
    };



    return fugue.deleteLocal(selection);
  }

  function reverseRemoveText(operations: BaseRemoveTextOperation[]): Operation[] {
    const cursor = {
      line: operations[0].path[0],
      column: operations[0].offset,
    };
    const text = operations.map(operation => operation.text.split('')).flat();
    return fugue.insertLocal(cursor, ...text);
  }

  return { undo, redo };
}

export default historyEvents;
