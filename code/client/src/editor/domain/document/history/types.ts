import { Cursor, Selection } from '@notespace/shared/types/cursor';
import {
  BaseInsertNodeOperation,
  BaseInsertTextOperation,
  BaseMergeNodeOperation,
  BaseMoveNodeOperation,
  BaseRemoveNodeOperation,
  BaseRemoveTextOperation,
  BaseSetNodeOperation,
  BaseSetSelectionOperation,
  BaseSplitNodeOperation,
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
  | MoveNodeOperation
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
  cursor: Cursor;
};

export type RemoveNodeOperation = {
  type: BaseRemoveNodeOperation['type'];
  cursor: Cursor;
};

export type SplitNodeOperation = {
  type: BaseSplitNodeOperation['type'];
  cursor: Cursor;
};

export type MergeNodeOperation = {
  type: BaseMergeNodeOperation['type'];
  cursor: Cursor;
};

export type MoveNodeOperation = {
  type: BaseMoveNodeOperation['type'];
  cursor: Cursor;
  target: Cursor;
};

export type SetNodeOperation = {
  type: BaseSetNodeOperation['type'];
  cursor: Cursor;
  properties: Partial<Node>;
  newProperties: Partial<Node>;
};

export type SetSelectionOperation = {
  type: BaseSetSelectionOperation['type'];
  properties: Partial<Range>;
  newProperties: Partial<Range>;
};
