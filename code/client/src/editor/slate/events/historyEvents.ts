import { BaseInsertTextOperation, BaseRemoveTextOperation, Editor } from 'slate';
import { Operation as SlateOperation } from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import { last } from 'lodash';
import { Communication } from '@socket/communication';
import { Operation } from '@notespace/shared/crdt/types/operations';

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
    if (undo) applyOperation(undo.operations);
  }

  function redo() {
    const { history } = editor;
    const redo = last(history.redos);
    if (redo) applyOperation(redo.operations);
  }

  function applyOperation(slateOperations: SlateOperation[]) {
    const operations = reverseOperations(slateOperations);
    communication.emitChunked('operation', operations);
  }

  function reverseOperations(operations: SlateOperation[]): Operation[] {
    switch (operations[0].type) {
      case 'insert_text': {
        return reverseInsertText(operations as BaseInsertTextOperation[]);
      }
      case 'remove_text': {
        return reverseRemoveText(operations as BaseRemoveTextOperation[]);
      }
      default:
        throw new Error('Invalid operation type: ' + operations[0].type);
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
