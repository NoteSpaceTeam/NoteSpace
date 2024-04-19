import {
  BaseInsertNodeOperation,
  BaseInsertTextOperation,
  BaseMergeNodeOperation,
  BaseMoveNodeOperation,
  BaseOperation,
  BaseRemoveNodeOperation,
  BaseRemoveTextOperation,
  BaseSetNodeOperation,
  BaseSetSelectionOperation,
  BaseSplitNodeOperation,
  Editor,
  Range,
} from 'slate';
import { last } from 'lodash';
import {
  HistoryDomainOperations,
  HistoryOperation, InsertNodeOperation,
  InsertTextOperation, MergeNodeOperation, MoveNodeOperation, RemoveNodeOperation,
  RemoveTextOperation, SetNodeOperation, SetSelectionOperation, SplitNodeOperation
} from '@editor/domain/document/history/types';
import {Cursor, emptySelection, Selection} from '@notespace/shared/types/cursor';
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
    const { history } = editor;
    applyOperations(last(history.undos), true);
  }

  function redoOperation() {
    const { history } = editor;
    applyOperations(last(history.redos), false); // redo should reverse the type of the last operation
  }

  /**
   * Applies a batch of operations to the editor
   * @param operations
   * @param reverseType - if true, the reverse operation will be the same type as the last operation
   */
  function applyOperations(operations: Batch | undefined, reverseType: boolean) {
    if (!operations) return;
    const selectionBefore = operations.selectionBefore;

    // Get each operation needed to be applied, as a batch can contain operations that are not in the same type
    const applyOperations = operations.operations.map(operation => {
      const type: BaseOperation['type'] = operation.type;
      const operationType = (reverseType) ? getReverseType(type) : type;
      return toHistoryOperation(operationType, operation, selectionBefore);
    });

    domainOperations.applyHistoryOperation(applyOperations);
  }

  /**
   * Converts a slate operation to a history operation
   * @param type
   * @param operation
   * @param selectionBefore
   */
  function toHistoryOperation(
      type: BaseOperation['type'],
      operation: BaseOperation,
      selectionBefore: Range | null,
  ): HistoryOperation {
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
      case 'set_node':
        return setNode(operation as BaseSetNodeOperation, selectionBefore);
      case 'set_selection':
        return setSelection(operation as BaseSetSelectionOperation);
    }
  }

  /**
   * Converts a slate insert text operation to a history insert text operation
   * @param operation
   */
  function insertTextOperation(operation: BaseInsertTextOperation): InsertTextOperation {
    const cursor: Cursor = { line: operation.path[0], column: operation.offset };
    const text = operation.text.split('');
    return { type: 'insert_text', cursor, text };
  }

  /**
   * Converts a slate remove text operation to a history remove text operation
   * @param operation
   */
  function removeTextOperation(operation: BaseRemoveTextOperation): RemoveTextOperation {
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

  /**
   * Converts a slate insert node operation to a history insert node operation
   * @param operation
   */
  function insertNodeOperation(operation: BaseInsertNodeOperation): InsertNodeOperation {
    console.log('insertNodeOperation', operation);
    return { type: 'insert_node', cursor: { line: 0, column: 0 } };
  }

  /**
   * Converts a slate remove node operation to a history remove node operation
   * @param operation
   */
  function removeNodeOperation(operation: BaseRemoveNodeOperation): RemoveNodeOperation {
    console.log('removeNodeOperation', operation);
    return { type: 'remove_node', cursor: { line: 0, column: 0 } };
  }

  /**
   * Converts a slate merge node operation to a history merge node operation
   * @param operation
   */
  function mergeNodeOperation(operation: BaseMergeNodeOperation): MergeNodeOperation {
    console.log('mergeNodeOperation', operation);
    return { type: 'merge_node', cursor: { line: 0, column: 0 } };
  }

  /**
   * Converts a slate split node operation to a history split node operation
   * @param operation
   */
  function splitNodeOperation(operation: BaseSplitNodeOperation): SplitNodeOperation {
    console.log('splitNodeOperation', operation);
    return { type: 'split_node', cursor: { line: 0, column: 0 } };
  }

  /**
   * Converts a slate move node operation to a history move node operation
   * @param operation
   */
  function moveNodeOperation(operation: BaseMoveNodeOperation): MoveNodeOperation {
    console.log('moveNodeOperation', operation);
    return { type: 'move_node', cursor: { line: 0, column: 0 }, target: { line: 0, column: 0 } };
  }

  /**
   * Converts a slate set node operation to a history set node operation
   * @param operation
   * @param selectionBefore
   */
  function setNode(operation: BaseSetNodeOperation, selectionBefore : Range | null): SetNodeOperation {
    const selection = emptySelection();
    return { type: 'set_node' , selection, properties: {}, newProperties: operation.properties };
  }

  /**
   * Converts a slate set selection operation to a history set selection operation
   * @param operation
   */
  function setSelection(operation: BaseSetSelectionOperation): SetSelectionOperation {
    console.log('setSelection', operation);
    return { type: 'set_selection', properties: {}, newProperties: {} };
  }

  return { undoOperation, redoOperation };
}

export default historyHandlers;
