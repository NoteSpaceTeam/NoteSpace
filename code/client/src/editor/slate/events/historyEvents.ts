import { BaseInsertTextOperation, BaseRemoveTextOperation, Editor, Operation, Range } from 'slate';
import { Operation as SlateOperation } from 'slate';
import { last } from 'lodash';
import { HistoryHandlers, HistoryOperation } from '@editor/domain/history/types';

export type HistoryOperations = {
  undo: () => void;
  redo: () => void;
};

interface Batch {
  operations: Operation[];
  selectionBefore: Range | null;
}

/**
 * Handles undo and redo operations
 * @param editor
 * @param handlers
 */
function historyEvents(editor: Editor, handlers: HistoryHandlers): HistoryOperations {
  function undo() {
    const { history } = editor;
    applyOperation(history.undos);
  }

  function redo() {
    const { history } = editor;
    applyOperation(history.redos);
  }

  function applyOperation(operations: Batch[]) {
    const historyOperation = last(operations);
    if (historyOperation) {
      const operation = reverseOperations(historyOperation.operations);
      handlers.onHistoryOperation(operation);
    }
  }

  function reverseOperations(operations: SlateOperation[]) {
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

  function reverseInsertText(operations: BaseInsertTextOperation[]): HistoryOperation {
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
    return { type: 'remove', selection };
  }

  function reverseRemoveText(operations: BaseRemoveTextOperation[]): HistoryOperation {
    const cursor = {
      line: operations[0].path[0],
      column: operations[0].offset,
    };
    const text = operations.map(operation => operation.text.split('')).flat();
    return { type: 'insert', cursor, text };
  }

  return { undo, redo };
}

export default historyEvents;
