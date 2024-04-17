import { Cursor, Selection } from '@notespace/shared/types/cursor';
import {BaseInsertNodeOperation, BaseInsertTextOperation, BaseRemoveTextOperation} from "slate";

export type HistoryHandlers = {
  onHistoryOperation: HistoryHandler;
};

export type HistoryHandler = (operation: HistoryOperation) => void;

export type HistoryOperation = onInsertTextOperation | onRemoveTextOperation;

export type onInsertTextOperation = {
  type: BaseInsertTextOperation["type"];
  cursor: Cursor;
  text: string[];
};

export type onRemoveTextOperation = {
    type: BaseRemoveTextOperation["type"];
  selection: Selection;
};

export type onInsertNodeOperation = {
    type: BaseInsertNodeOperation["type"];
    cursor: Cursor;
};

export type onRemoveNodeOperation = {
    type: BaseInsertNodeOperation["type"];
    cursor: Cursor;
};

export type onMergeNodeOperation = {
    type: BaseInsertNodeOperation["type"];
    cursor: Cursor;
};



