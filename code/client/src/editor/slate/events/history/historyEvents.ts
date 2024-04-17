import { BaseInsertTextOperation, BaseRemoveTextOperation, Editor, Operation, Range } from 'slate';
import { Operation as SlateOperation } from 'slate';
import { last } from 'lodash';
import { HistoryHandlers, HistoryOperation } from '@editor/domain/handlers/history/types';
import {Cursor, Selection} from "@notespace/shared/types/cursor";
import {getReverseType} from "@editor/slate/events/history/utils";

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
    console.log("history", history.undos);
    reverseOperations(history.undos, true);
  }

  function onRedo() {
    const { history } = editor;
    console.log("history", history.redos);
    reverseOperations(history.redos, false); // redo should reverse the type of the last operation
  }

  /**
   * Applies the operation to the editor
   * @param operations
   * @param reverseType - if true, the reverse operation will be the same type as the last operation
   */
  function reverseOperations(operations: Batch[], reverseType: boolean) {
    const historyOperation = last(operations);
    if (historyOperation) {
      const type = historyOperation.operations[0].type;
      const operationType = (reverseType) ? getReverseType(type) : type
      const operation = getHistoryOperation(historyOperation.operations, operationType);
      handlers.onHistoryOperation(operation);
    }
  }


  function getHistoryOperation(operations: Operation[], type: string): HistoryOperation {
    console.log("type", type);
    switch (type) {
      case 'insert_text': return insertTextOperation(operations as BaseInsertTextOperation[])
      case 'remove_text': return removeTextOperation(operations as BaseRemoveTextOperation[])
      case 'insert_node': return insertNodeOperation(operations as SlateOperation[])
      case 'remove_node': return removeNodeOperation(operations as SlateOperation[])
      case 'merge_node': return mergeNodeOperation(operations as SlateOperation[])
      case 'split_node': return splitNodeOperation(operations as SlateOperation[])
      case 'move_node': return moveNodeOperation(operations as SlateOperation[])
      default:
        throw new Error('Invalid operation type: ' + type);
    }
  }

  /* OPERATIONS HANDLERS*/

  function insertTextOperation(operations: BaseRemoveTextOperation[]): HistoryOperation {
    const cursor: Cursor = {line: operations[0].path[0], column: operations[0].offset}
    const text = operations.map(operation => operation.text.split('')).flat();
    return { type: 'insert', cursor, text };
  }

  function removeTextOperation(operations: BaseInsertTextOperation[]): HistoryOperation {
    const path = last(operations)!.path[0] - operations[0].path[0];
    const offset = last(operations)!.offset - operations[0].offset;
    const length = operations.map(operation => operation.text).length;
    const selection : Selection = {
      start: {line: path, column: offset - length + 1},
      end: {line: path, column: offset + 1}
    };
    return { type: 'remove', selection };
  }



  function insertNodeOperation(operations: SlateOperation[]): HistoryOperation {
    return { type: 'inser' };
  }

  function removeNodeOperation(operations: SlateOperation[]): HistoryOperation {
      return { type: 'insert_node' };
  }

  function mergeNodeOperation(operations: SlateOperation[]): HistoryOperation {
      return { type: 'split_node' };
  }

  function splitNodeOperation(operations: SlateOperation[]): HistoryOperation {
      return { type: 'merge_node' };
  }

  function moveNodeOperation(operations: SlateOperation[]): HistoryOperation {
      return { type: 'move_node' };
  }

  return { onUndo, onRedo };
}

export default historyEvents;
