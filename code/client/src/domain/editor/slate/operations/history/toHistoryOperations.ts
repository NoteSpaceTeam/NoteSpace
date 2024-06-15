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
} from '@domain/editor/shared/historyTypes';
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
 * Converts slate operations to history operations
 * @param editor
 * @param operations
 * @param reverseType - if true, the reverse operation will be the same type as the last operation
 */
function toHistoryOperations(editor: Editor, operations: Batch | undefined, reverseType: boolean): HistoryOperation[] {
  if (!operations) return [];

  return operations.operations
    .map(operation => {
      const type: BaseOperation['type'] = operation.type;
      const operationType = reverseType ? getReverseType(type) : (type as HistoryOperation['type']);
      return toHistoryOperation(editor, operationType, operations.selectionBefore, operation);
    })
    .filter(operation => operation !== undefined) as HistoryOperation[];
}

function toHistoryOperation(
  editor: Editor,
  type: HistoryOperation['type'],
  selectionBefore: BaseRange | null,
  operation: BaseOperation
): HistoryOperation | undefined {
  switch (type) {
    case 'insert_text':
      return insertTextOperation(editor, operation as BaseInsertTextOperation);
    case 'remove_text':
      return removeTextOperation(editor, operation as BaseRemoveTextOperation);
    case 'insert_node':
      return nodeOperation(editor, operation as BaseInsertNodeOperation, true);
    case 'remove_node':
      return nodeOperation(editor, operation as BaseRemoveNodeOperation, false);
    case 'merge_node':
      return handleNodeOperation(editor, operation as BaseMergeNodeOperation, selectionBefore?.anchor.offset, true);
    case 'split_node':
      return handleNodeOperation(editor, operation as BaseSplitNodeOperation, selectionBefore?.anchor.offset, false);
    case 'set_node' || 'unset_node':
      return setNodeOperation(
        editor,
        operation as BaseSetNodeOperation,
        selectionBefore?.anchor.offset,
        type === 'set_node'
      );
  }
}

/**
 * Converts a slate insert text operation to a history insert text operation
 * @param editor
 * @param operation
 */
function insertTextOperation(editor: Editor, operation: BaseInsertTextOperation): InsertTextOperation | undefined {
  if (operation.text === '') return undefined;

  // Get the cursor position to insert the text
  const start = pointToCursor(editor, { path: operation.path, offset: operation.offset });

  const text = operation.text.split('');
  return { type: 'insert_text', cursor: { ...start, column: start.column }, text };
}

/**
 * Converts a slate remove text operation to a history remove text operation
 * @param editor
 * @param operation
 */
function removeTextOperation(
  editor: Editor,
  operation: BaseRemoveTextOperation,
): RemoveTextOperation | undefined {
  if (operation.text === '') return undefined;

  // Normalize selection to account for line root nodes
  const start = pointToCursor(editor, {...operation });

  const end = {
    line: start.line,
    column: start.column + operation.text.length,
  }

  const selection = { start, end };
  return { type: 'remove_text', selection };
}

/**
 * Handles a slate insert or remove node operation
 * @param editor
 * @param operation
 * @param insert_mode
 */
function nodeOperation(
  editor: Editor,
  operation: BaseInsertNodeOperation | BaseRemoveNodeOperation,
  insert_mode: boolean
): InsertNodeOperation | RemoveNodeOperation | undefined {
  const lineOperation = operation.path.length === 1;

  const cursor = pointToCursor(editor, {path: operation.path, offset: 0});

  const start = lineOperation
    ? { line: operation.path[0] + 1, column: 0 }
    : { ...cursor, column: cursor.column + lineOffset(cursor.line) };

  let end = start;

  if(!lineOperation){
    if(!Text.isText(operation.node) || !operation.node.text) return undefined;
    end = {
      ...start,
      column: start.column + (operation.node as Text).text.length,
    }
  }
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
 * @param editor
 * @param operation
 * @param offset
 * @param merge_mode
 */
function handleNodeOperation(
  editor: Editor,
  operation: BaseMergeNodeOperation | BaseSplitNodeOperation,
  offset: number | undefined,
  merge_mode: boolean
): MergeNodeOperation | SplitNodeOperation | undefined {
  // Ignore nested nodes as this is done implicitly by fugue
  if (operation.path.length > 1) return undefined;
  if (!(operation.properties as Element).type) return undefined;

  const path = [operation.path[0] + (merge_mode ? 1 : 0), 0];
  const type = merge_mode ? 'merge_node' : 'split_node';
  const cursor = pointToCursor(editor, { path, offset: offset || 0 });

  return {
    type,
    cursor,
    properties: operation.properties,
  };
}

/**
 * Handles a slate set or unset node operation
 * @param editor
 * @param operation
 * @param offset
 * @param set_mode
 */
function setNodeOperation(
  editor: Editor,
  operation: BaseSetNodeOperation,
  offset: number | undefined,
  set_mode: boolean
): SetNodeOperation | UnsetNodeOperation {
  const lineOperation = operation.path.length === 1;

  const start = lineOperation
    ? { line: operation.path[0], column: 0 }
    : pointToCursor(editor, { path: operation.path, offset: 0 });

  const end = {
    ...start,
    column: lineOperation ? Infinity : start.column + (offset || 0),
  };

  return {
    type: set_mode ? 'set_node' : 'unset_node',
    lineOperation,
    selection: { start, end },
    properties: set_mode ? operation.properties : operation.newProperties,
  };
}

const lineOffset = (line: number) => (line === 0 ? 0 : 1);

export { toHistoryOperations };
