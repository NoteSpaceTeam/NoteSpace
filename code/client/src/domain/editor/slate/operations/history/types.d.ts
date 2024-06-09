import {
  BaseInsertNodeOperation,
  BaseInsertTextOperation,
  BaseMergeNodeOperation,
  BaseRemoveNodeOperation,
  BaseRemoveTextOperation,
  BaseSetNodeOperation,
  BaseSplitNodeOperation,
  Node,
} from 'slate';
import { Cursor, Selection } from '@domain/editor/cursor';

export type HistoryOperation =
  | InsertTextOperation
  | RemoveTextOperation
  | InsertNodeOperation
  | RemoveNodeOperation
  | SplitNodeOperation
  | MergeNodeOperation
  | SetNodeOperation
  | UnsetNodeOperation;

/**
 * Base operation for inserting text
 * @param type - The type of the operation
 * @param cursor - The cursor position to insert the text
 * @param text - The text to insert
 */
export type InsertTextOperation = {
  type: BaseInsertTextOperation['type'];
  cursor: Cursor;
  text: string[];
};

/**
 * Base operation for removing text
 * @param type - The type of the operation
 * @param selection - The selection to remove the text
 */
export type RemoveTextOperation = {
  type: BaseRemoveTextOperation['type'];
  selection: Selection;
};

/**
 * Base operation for inserting a node
 * @param type - The type of the operation
 * @param node - The node to insert
 * @param selection - The selection to insert the node
 */
export type InsertNodeOperation = {
  type: BaseInsertNodeOperation['type'];
  node: Node;
  lineOperation: boolean;
  selection: Selection;
};

/**
 * Base operation for removing a node
 * @param type - The type of the operation
 * @param node - The node to remove
 * @param selection - The selection to remove the node
 */
export type RemoveNodeOperation = {
  type: BaseRemoveNodeOperation['type'];
  node: Node;
  lineOperation: boolean;
  selection: Selection;
};

/**
 * Base operation for splitting a node
 * @param type - The type of the operation
 * @param properties - The properties of the node
 * @param cursor - The cursor position to split the node
 */
export type SplitNodeOperation = {
  type: BaseSplitNodeOperation['type'];
  properties: Partial<Node>;
  cursor: Cursor;
};

/**
 * Base operation for merging a node
 * @param type - The type of the operation
 * @param properties - The properties of the node
 * @param cursor - The cursor position to merge the node
 */
export type MergeNodeOperation = {
  type: BaseMergeNodeOperation['type'];
  properties: Partial<Node>;
  cursor: Cursor;
};

/**
 * Base operation for setting a node
 * @param type - The type of the operation
 * @param selection - The selection to set the node
 * @param properties - The properties of the node
 * @param newProperties - The new properties of the node
 */
export type SetNodeOperation = {
  type: BaseSetNodeOperation['type'];
  lineOperation: boolean;
  selection: Selection;
  properties: Partial<Node>;
};

/**
 * Base operation for unsetting a node
 * @param type - The type of the operation
 * @param selection - The selection to unset the node
 * @param properties - The properties of the node
 * @param newProperties - The new properties of the node
 */
export type UnsetNodeOperation = {
  type: 'unset_node';
  lineOperation: boolean;
  selection: Selection;
  properties: Partial<Node>;
};
