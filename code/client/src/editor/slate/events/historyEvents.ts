import { BaseInsertTextOperation, BaseRemoveTextOperation, Editor, Operation, Range } from 'slate';
import { Operation as SlateOperation } from 'slate';
import { last } from 'lodash';
import { HistoryHandlers, HistoryOperation } from '@editor/domain/handlers/history/types';

export type HistoryOperations = {
  onUndo: () => void;
  onRedo: () => void;
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
  function onUndo() {
    const { history } = editor;
    applyOperation(history.undos, true);
  }

  function onRedo() {
    const { history } = editor;
    applyOperation(history.redos, false); // redo should reverse the type of the last operation
  }

  /**
   * Applies the operation to the editor
   * @param operations
   * @param matchType - if true, the reverse operation will be the same type as the last operation
   */
  function applyOperation(operations: Batch[], matchType: boolean) {
    const historyOperation = last(operations);
    if (historyOperation) {
      const operation = reverseOperations(historyOperation.operations, matchType);
      handlers.onHistoryOperation(operation);
    }
  }

  function reverseOperations(operations: SlateOperation[], matchType: boolean) {
    const type = operations[0].type;
    switch (type) {
      case 'insert_text': {
        return matchType
          ? reverseInsertText(operations as BaseInsertTextOperation[])
          : reverseRemoveText(operations as BaseRemoveTextOperation[]);
      }
      case 'remove_text': {
        return matchType
          ? reverseRemoveText(operations as BaseRemoveTextOperation[])
          : reverseInsertText(operations as BaseInsertTextOperation[]);
      }
      default:
        throw new Error('Invalid operation type: ' + type);
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
  return { onUndo, onRedo };
}

export default historyEvents;
