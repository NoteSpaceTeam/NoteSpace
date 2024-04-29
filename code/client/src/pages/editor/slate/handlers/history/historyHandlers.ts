import {
  BaseInsertNodeOperation,
  BaseInsertTextOperation,
  BaseMergeNodeOperation,
  BaseOperation,
  BaseRange,
  BaseRemoveNodeOperation,
  BaseRemoveTextOperation,
  BaseSetNodeOperation,
  BaseSplitNodeOperation,
  Editor,
  Range,
} from 'slate';
import { last } from 'lodash';
import {
  HistoryDomainOperations,
  HistoryOperation,
  InsertNodeOperation,
  InsertTextOperation,
  MergeNodeOperation,
  RemoveNodeOperation,
  RemoveTextOperation,
  SetNodeOperation,
  SplitNodeOperation,
  UnsetNodeOperation,
} from '@pages/editor/domain/document/history/types.ts';
import { getReverseType } from '@pages/editor/slate/handlers/history/utils.ts';
import { pointToCursor } from '@pages/editor/slate/utils/selection.ts';

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

    // get each operation needed to be applied, as a batch can contain operations that are not in the same type
    const applyOperations = operations.operations
      .map(operation => {
        const type: BaseOperation['type'] = operation.type;
        const operationType = reverseType
            ? getReverseType(type)
            : (type as HistoryOperation['type']);
        return toHistoryOperation(operationType, operation, operations.selectionBefore);
      })
      .filter(operation => operation !== undefined) as HistoryOperation[];

    domainOperations.applyHistoryOperation(applyOperations);
  }

  /**
   * Converts a slate operation to a history operation
   * @param type
   * @param operation
   * @param selectionBefore
   */
  function toHistoryOperation(
    type: HistoryOperation['type'],
    operation: BaseOperation,
    selectionBefore: BaseRange | null
  ): HistoryOperation | undefined {
    switch (type) {
      case 'insert_text':
        return insertTextOperation(operation as BaseInsertTextOperation, selectionBefore?.focus.offset);
      case 'remove_text':
        return removeTextOperation(operation as BaseRemoveTextOperation);
      case 'insert_node':
        return nodeOperation(operation as BaseInsertNodeOperation, selectionBefore?.focus.offset, true);
      case 'remove_node':
        return nodeOperation(operation as BaseRemoveNodeOperation, selectionBefore?.focus.offset, false);
      case 'merge_node':
        return handleNodeOperation(operation as BaseMergeNodeOperation, true);
      case 'split_node':
        return handleNodeOperation(operation as BaseSplitNodeOperation, false);
      case 'set_node':
        return setNodeOperation(operation as BaseSetNodeOperation, selectionBefore?.anchor.offset, true);
      case 'unset_node':
        return setNodeOperation(operation as BaseSetNodeOperation, selectionBefore?.anchor.offset, false);
      default:
        throw new Error(`Invalid operation type: ${type}`);
    }
  }

  /**
   * Converts a slate insert text operation to a history insert text operation
   * @param operation
   * @param focus_offset
   */
  function insertTextOperation(
    operation: BaseInsertTextOperation,
    focus_offset: number | undefined
  ): InsertTextOperation | undefined {
    if (operation.text === '') return undefined;

    const start = {
      line: operation.path[0],
      column: focus_offset || 0,
    };

    const text = operation.text.split('');
    return { type: 'insert_text', cursor: { ...start, column: start.column }, text };
  }

  /**
   * Converts a slate remove text operation to a history remove text operation
   * @param operation
   */
  function removeTextOperation(operation: BaseRemoveTextOperation): RemoveTextOperation | undefined {
    const offset = (line: number) => (line === 0 ? 0 : 1);

    if (operation.text === '') return undefined;

    const cursor = pointToCursor(editor, { path: operation.path, offset: 0 });

    const start = {
      line: operation.path[0],
      column: cursor.column + operation.offset,
    };
    const end = {
      line: start.line,
      column: start.column + operation.text.length - 1 + offset(start.line),
    };

    const selection = { start, end };
    return { type: 'remove_text', selection };
  }

  /**
   * Handles a slate insert or remove node operation
   * @param operation
   * @param focus_offset
   * @param insert_mode
   */
  function nodeOperation(
    operation: BaseInsertNodeOperation | BaseRemoveNodeOperation,
    focus_offset: number | undefined,
    insert_mode: boolean
  ): InsertNodeOperation | RemoveNodeOperation | undefined {
    console.log(insert_mode ? 'insertNodeOperation' : 'removeNodeOperation', operation);
    if (operation.node.text === '') return undefined;

    const offset = (line: number) => (line === 0 ? 0 : 1);

    const start = {
      line: operation.path[0],
      column: focus_offset || 0,
    };

    const end = {
      ...start,
      column: start.column + operation.node.text.length - 1 + offset(start.line),
    };

    const selection = { start, end };

    return {
      type: insert_mode ? 'insert_node' : 'remove_node',
      selection,
      node: operation.node,
    };
  }

  /**
   * Handles a slate merge or split node operation
   * @param operation
   * @param merge_mode
   */
  function handleNodeOperation(
    operation: BaseMergeNodeOperation | BaseSplitNodeOperation,
    merge_mode: boolean
  ): MergeNodeOperation | SplitNodeOperation | undefined {
    if (!operation.properties.type) return undefined;

    return {
      type: merge_mode ? 'merge_node' : 'split_node',
      cursor: { line: operation.position, column: 0 },
      properties: operation.properties,
    };
  }

  /**
   * Handles a slate set or unset node operation
   * @param operation
   * @param offset
   * @param set_mode
   */
  function setNodeOperation(
    operation: BaseSetNodeOperation,
    offset: number | undefined,
    set_mode: boolean
  ): SetNodeOperation | UnsetNodeOperation {
    const start = pointToCursor(editor, { path: operation.path, offset: 0 });

    const end = {
      ...start,
      column: offset ? offset - 1 : start.column,
    };

    return {
      type: set_mode ? 'set_node' : 'unset_node',
      selection: { start, end },
      properties: set_mode ? operation.properties : operation.newProperties,
    };
  }

  return { undoOperation, redoOperation };
}

export default historyHandlers;
