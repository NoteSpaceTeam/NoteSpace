import { Cursor, Selection } from '@notespace/shared/types/cursor';
import {
  BaseInsertNodeOperation,
  BaseInsertTextOperation,
  BaseMergeNodeOperation,
  BaseRemoveNodeOperation,
  BaseRemoveTextOperation,
  BaseSetNodeOperation,
  BaseSetSelectionOperation,
  BaseSplitNodeOperation,
  Node
} from 'slate';

export type HistoryDomainOperations = {
  applyHistoryOperation: ApplyHistory;
};

export type ApplyHistory = (operations: HistoryOperation[]) => void;

export type HistoryOperation =
  | InsertTextOperation
  | RemoveTextOperation
  | InsertNodeOperation
  | RemoveNodeOperation
  | SplitNodeOperation
  | MergeNodeOperation
  | SetNodeOperation
  | SetSelectionOperation;

export type InsertTextOperation = {
  type: BaseInsertTextOperation['type'];
  cursor: Cursor;
  text: string[];
};

export type RemoveTextOperation = {
  type: BaseRemoveTextOperation['type'];
  selection: Selection;
};

export type InsertNodeOperation = {
  type: BaseInsertNodeOperation['type'];
  node: Node;
  cursor: Cursor;
};

export type RemoveNodeOperation = {
  type: BaseRemoveNodeOperation['type'];
  node: Node;
  cursor: Cursor;
};

export type SplitNodeOperation = {
  type: BaseSplitNodeOperation['type'];
  properties: Partial<Node>;
  cursor: Cursor;
};

export type MergeNodeOperation = {
  type: BaseMergeNodeOperation['type'];
  properties: Partial<Node>;
  cursor: Cursor;
};


export type SetNodeOperation = {
  type: BaseSetNodeOperation['type'];
  selection: Selection;
  properties: Partial<Node>;
  newProperties: Partial<Node>;
};

export type SetSelectionOperation = {
  type: BaseSetSelectionOperation['type'];
  properties: Partial<Range>;
  newProperties: Partial<Range>;
};
