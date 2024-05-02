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
} from '@/domain/editor/operations/history/types';
import { pointToCursor } from '@/domain/editor/slate/utils/selection';

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
function toHistoryOperations(
    editor: Editor,
    operations: Batch | undefined,
    reverseType: boolean
): HistoryOperation[] {
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
        return removeTextOperation(operation as BaseRemoveTextOperation);
      case 'insert_node':
        return nodeOperation(operation as BaseInsertNodeOperation, true);
      case 'remove_node':
        return nodeOperation(operation as BaseRemoveNodeOperation, false);
      case 'merge_node':
        return handleNodeOperation(
            operation as BaseMergeNodeOperation,
            selectionBefore?.anchor.offset,
            true
        );
      case 'split_node':
        return handleNodeOperation(
            operation as BaseSplitNodeOperation,
            selectionBefore?.anchor.offset,
            false
        );
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

    const start = pointToCursor(editor, { path: operation.path, offset: operation.offset });
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
   * @param insert_mode
   */
  function nodeOperation(
    operation: BaseInsertNodeOperation | BaseRemoveNodeOperation,
    insert_mode: boolean
  ): InsertNodeOperation | RemoveNodeOperation | undefined {
    console.log(insert_mode ? 'insertNodeOperation' : 'removeNodeOperation', operation);
    if (operation.node.text === '') return undefined;

    const offset = (line: number) => (line === 0 ? 0 : 1);

    const start = pointToCursor(editor, { path: operation.path, offset: 0 });

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
   * @param offset
   * @param merge_mode
   */
  function handleNodeOperation(
    operation: BaseMergeNodeOperation | BaseSplitNodeOperation,
    offset: number | undefined,
    merge_mode: boolean
  ): MergeNodeOperation | SplitNodeOperation | undefined {
    if (!operation.properties.type) return undefined;


      return (merge_mode) ? {
        type: 'merge_node',
        cursor: pointToCursor(editor, { path: [operation.path[0] + 1, 0], offset: 0 }),
        properties: operation.properties,
      } : {
        type: 'split_node',
        cursor: pointToCursor(editor, { path: [operation.path[0], 0], offset: offset || 0 }),
        properties: operation.properties,
      }
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

    const start = pointToCursor(editor, { path: operation.path, offset: 0 });

    const end = {
      ...start,
      column: start.column + (offset || 0),
    };

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
      const operationType = reverseType
          ? getReverseType(type)
          : (type as HistoryOperation['type']);
      return toHistoryOperation(operationType, operations.selectionBefore, operation);
    }).filter(operation => operation !== undefined) as HistoryOperation[];
}

export { toHistoryOperations };
