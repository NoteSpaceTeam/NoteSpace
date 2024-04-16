import { Cursor, Selection } from '@notespace/shared/types/cursor';

export type HistoryHandlers = {
  onHistoryOperation: HistoryHandler;
};

export type HistoryHandler = (operation: HistoryOperation) => void;

export type HistoryOperation = onInsertTextOperation | onRemoveTextOperation;

export type onInsertTextOperation = {
  type: 'insert';
  cursor: Cursor;
  text: string[];
};

export type onRemoveTextOperation = {
  type: 'remove';
  selection: Selection;
};
