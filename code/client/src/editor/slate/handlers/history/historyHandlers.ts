import {
  BaseInsertNodeOperation,
  BaseInsertTextOperation, BaseMergeNodeOperation, BaseMoveNodeOperation,
  BaseOperation, BaseRemoveNodeOperation,
  BaseRemoveTextOperation, BaseSetNodeOperation, BaseSetSelectionOperation,
  BaseSplitNodeOperation,
  Editor,
  Range
} from 'slate';
import {last} from 'lodash';
import {HistoryDomainOperations, HistoryOperation} from '@editor/domain/document/history/types';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { getReverseType } from '@editor/slate/handlers/history/utils';

export type HistoryHandlers = {
  undoOperation: () => void;
  redoOperation: () => void;
};

interface Batch {
  operations: BaseOperation[];
  selectionBefore: Range | null;
}

/**
 * Handles undo and redo operations
 * @param editor
 * @param domainOperations
 */
function historyHandlers(editor: Editor, domainOperations: HistoryDomainOperations): HistoryHandlers {
  function undoOperation() {
    console.log("Undoing...")
    const { history } = editor;
    applyOperations(last(history.undos), true);
  }

  function redoOperation() {
    console.log("Redoing...")
    const { history } = editor;
    applyOperations(last(history.redos), false); // redo should reverse the type of the last operation
  }

  /**
   * Applies the operation to the editor
   * @param operations
   * @param reverseType - if true, the reverse operation will be the same type as the last operation
   */
  function applyOperations(operations: Batch | undefined, reverseType: boolean) {
    if(!operations) return;

    // Get each operation needed to be applied, as a batch can contain operations that are not in the same type
    const applyOperations = operations.operations.map(operation => {
        const type : BaseOperation["type"] = operation.type;
        const operationType = reverseType ? getReverseType(type) : type;
        return getHistoryOperation(operation, operationType);
    })
    domainOperations.applyHistoryOperation(applyOperations);
  }

  function getHistoryOperation(operation: BaseOperation, type: BaseOperation["type"]): HistoryOperation {
    console.log('type', type);
    switch (type) {
      case 'insert_text':
        return insertTextOperation(operation as BaseInsertTextOperation);
      case 'remove_text':
        return removeTextOperation(operation as BaseRemoveTextOperation);
      case 'insert_node':
        return insertNodeOperation(operation as BaseInsertNodeOperation);
      case 'remove_node':
        return removeNodeOperation(operation as BaseRemoveNodeOperation);
      case 'merge_node':
        return mergeNodeOperation(operation as BaseMergeNodeOperation);
      case 'split_node':
        return splitNodeOperation(operation as BaseSplitNodeOperation);
      case 'move_node':
        return moveNodeOperation(operation as BaseMoveNodeOperation);
      case "set_node":
        return setNode(operation as BaseSetNodeOperation);
      case "set_selection":
        return setSelection(operation as BaseSetSelectionOperation);
    }
  }

  function insertTextOperation(operation: BaseInsertTextOperation): HistoryOperation {
    const cursor: Cursor = { line: operation.path[0], column: operation.offset };
    const text = operation.text.split('');
    return { type: 'insert_text', cursor, text };
  }

  function removeTextOperation(operation: BaseRemoveTextOperation): HistoryOperation {
    const offset = (line: number) => (line === 0 ? 0 : 1);

    const startLine = operation.path[0];
    const startColumn = operation.offset + offset(startLine);
    const start = { line: startLine, column: startColumn };

    const endLine = operation?.path[0] || start.line;
    const endColumn = (operation?.offset || start.column) + offset(endLine);
    const end = { line: endLine, column: endColumn };

    const selection: Selection = { start, end };
    return { type: 'remove_text', selection };
  }

  function insertNodeOperation(operation: BaseInsertNodeOperation): HistoryOperation {
    console.log('insertNodeOperation', operation);
    return { type: 'insert_node', cursor: { line: 0, column: 0 }};
  }

  function removeNodeOperation(operation: BaseRemoveNodeOperation): HistoryOperation {
    console.log('removeNodeOperation', operation);
    return { type: 'remove_node', cursor: { line: 0, column: 0 }};
  }

  function mergeNodeOperation(operation: BaseMergeNodeOperation): HistoryOperation {
    console.log('mergeNodeOperation', operation);
    return { type: 'merge_node', cursor: { line: 0, column: 0 }};
  }

  function splitNodeOperation(operation: BaseSplitNodeOperation): HistoryOperation {
    console.log('splitNodeOperation', operation);
    return { type: 'split_node', cursor: { line: 0, column: 0 }};
  }

  function moveNodeOperation(operation : BaseMoveNodeOperation): HistoryOperation {
    console.log('moveNodeOperation', operation);
    return { type: 'move_node', cursor: { line: 0, column: 0 }, target: { line: 0, column: 0 }};
  }

  function setNode(operation: BaseSetNodeOperation): HistoryOperation {
      console.log('setNode', operation);
      return { type: 'set_node', cursor: { line: 0, column: 0 }, properties: {}, newProperties: operation.properties };
  }

  function setSelection(operation: BaseSetSelectionOperation): HistoryOperation {
      console.log('setSelection', operation);
      return { type: 'set_selection', properties: {}, newProperties: {} };
  }

  return { undoOperation, redoOperation };
}

export default historyHandlers;
