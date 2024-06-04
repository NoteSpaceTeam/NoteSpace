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
  Element,
  Range,
  Text,
} from 'slate';
import {
  HistoryOperation,
  InsertNodeOperation,
  InsertTextOperation,
  MergeNodeOperation,
  RemoveNodeOperation,
  RemoveTextOperation,
  SetNodeOperation,
  SplitNodeOperation,
  UnsetNodeOperation,
} from '@domain/editor/operations/history/types';
import { pointToCursor } from '@domain/editor/slate/utils/selection';

const reverseTypes: { [key: string]: HistoryOperation['type'] } = {
  insert_text: 'remove_text',
  remove_text: 'insert_text',
  insert_node: 'remove_node',
  remove_node: 'insert_node',
  merge_node: 'split_node',
  split_node: 'merge_node',
  set_node: 'unset_node',
};

const getReverseType = (type: BaseOperation['type']) => reverseTypes[type] || type;

export interface Batch {
  operations: BaseOperation[];
  selectionBefore: Range | null;
}

/**
 * Applies a batch of operations to the editor
 * @param editor
 * @param operations
 * @param reverseType - if true, the reverse operation will be the same type as the last operation
 */
function toHistoryOperations(editor: Editor, operations: Batch | undefined, reverseType: boolean): HistoryOperation[] {
  if (!operations) return [];

  /**
   * Converts a slate operation to a history operation
   * @param type
   * @param operation
   * @param selectionBefore
   */
  function toHistoryOperation(
    type: HistoryOperation['type'],
    selectionBefore: BaseRange | null,
    operation: BaseOperation
  ): HistoryOperation | undefined {
    switch (type) {
      case 'insert_text':
        return insertTextOperation(operation as BaseInsertTextOperation);
      case 'remove_text':
        return removeTextOperation(operation as BaseRemoveTextOperation, selectionBefore);
      case 'insert_node':
        return nodeOperation(operation as BaseInsertNodeOperation, selectionBefore, true);
      case 'remove_node':
        return nodeOperation(operation as BaseRemoveNodeOperation, selectionBefore, false);
      case 'merge_node':
        return handleNodeOperation(operation as BaseMergeNodeOperation, selectionBefore?.anchor.offset, true);
      case 'split_node':
        return handleNodeOperation(operation as BaseSplitNodeOperation, selectionBefore?.anchor.offset, false);
      case 'set_node':
        return setNodeOperation(operation as BaseSetNodeOperation, selectionBefore?.anchor.offset, true);
      case 'unset_node':
        return setNodeOperation(operation as BaseSetNodeOperation, selectionBefore?.anchor.offset, false);
    }
  }

  /**
   * Converts a slate insert text operation to a history insert text operation
   * @param operation
   */
  function insertTextOperation(operation: BaseInsertTextOperation): InsertTextOperation | undefined {
    if (operation.text === '') return undefined;

    // Get the cursor position to insert the text
    const start = pointToCursor(editor, { path: operation.path, offset: operation.offset });

    const text = operation.text.split('');
    return { type: 'insert_text', cursor: { ...start, column: start.column }, text };
  }

  /**
   * Converts a slate remove text operation to a history remove text operation
   * @param operation
   * @param selectionBefore
   */
  function removeTextOperation(
    operation: BaseRemoveTextOperation,
    selectionBefore: BaseRange | null
  ): RemoveTextOperation | undefined {
    if (operation.text === '') return undefined;
    if (!selectionBefore) return undefined;

    // Normalize selection to account for line root nodes
    const start = pointToCursor(editor, { ...selectionBefore.anchor });

    const end = {
      ...start,
      column: start.column + operation.text.length,
    };

    const selection = { start, end };
    return { type: 'remove_text', selection };
  }

  /**
   * Handles a slate insert or remove node operation
   * @param operation
   * @param selectionBefore
   * @param insert_mode
   */
  function nodeOperation(
    operation: BaseInsertNodeOperation | BaseRemoveNodeOperation,
    selectionBefore: BaseRange | null,
    insert_mode: boolean
  ): InsertNodeOperation | RemoveNodeOperation | undefined {
    const lineOperation = operation.path.length === 1;

    // Whole line operation - insert or remove a line
    if (lineOperation) {
      const start = { line: operation.path[0], column: 0 };

      const selection = { start, end: start }; // End is the same as start for whole line operations

      if (insert_mode) return undefined; // Whole line insert operation is ignored

      return {
        type: insert_mode ? 'insert_node' : 'remove_node',
        selection,
        lineOperation,
        node: operation.node,
      };
    }

    if (!Text.isText(operation.node)) return; // Only text nodes are supported

    if (operation.node.text === '') return undefined; // Empty text nodes are ignored

    if (!selectionBefore) return undefined; // No selection before operation - ignore

    const cursor = pointToCursor(editor, selectionBefore.anchor);

    const start = {
      ...cursor,
      column: cursor.column + lineOffset(cursor.line),
    };

    const end = {
      ...start,
      column: start.column + operation.node.text.length,
    };

    const selection = { start, end };

    return {
      type: insert_mode ? 'insert_node' : 'remove_node',
      selection,
      lineOperation,
      node: operation.node,
    };
  }

  /**
   * Handles a slate merge or split node operation
   * @param operation
   * @param offset
   * @param merge_mode
   */
  function handleNodeOperation(
    operation: BaseMergeNodeOperation | BaseSplitNodeOperation,
    offset: number | undefined,
    merge_mode: boolean
  ): MergeNodeOperation | SplitNodeOperation | undefined {
    if (operation.path.length > 1) return undefined; // Ignore nested nodes as this is done implicitly by fugue
    if (!(operation.properties as Element).type) return undefined;

    return merge_mode
      ? {
          type: 'merge_node',
          cursor: pointToCursor(editor, { path: [operation.path[0] + 1, 0], offset: 0 }),
          properties: operation.properties,
        }
      : {
          type: 'split_node',
          cursor: pointToCursor(editor, { path: [operation.path[0], 0], offset: offset || 0 }),
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
    const lineOperation = operation.path.length === 1;

    // Whole line operation
    if (lineOperation) {
      const start = { line: operation.path[0], column: 0 };
      const end = { ...start, column: Infinity };

      return {
        type: set_mode ? 'set_node' : 'unset_node',
        lineOperation,
        selection: { start, end },
        properties: operation.properties,
      };
    }

    const start = pointToCursor(editor, { path: operation.path, offset: 0 });

    const end = { ...start, column: start.column + (offset || 0) };

    return {
      type: set_mode ? 'set_node' : 'unset_node',
      lineOperation,
      selection: { start, end },
      properties: set_mode ? operation.properties : operation.newProperties,
    };
  }

  return operations.operations
    .map(operation => {
      const type: BaseOperation['type'] = operation.type;
      const operationType = reverseType ? getReverseType(type) : (type as HistoryOperation['type']);
      return toHistoryOperation(operationType, operations.selectionBefore, operation);
    })
    .filter(operation => operation !== undefined) as HistoryOperation[];
}

const lineOffset = (line: number) => (line === 0 ? 0 : 1);

export { toHistoryOperations };
