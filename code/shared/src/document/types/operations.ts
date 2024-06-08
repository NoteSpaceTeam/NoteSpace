import { Id } from "./types";
import { InlineStyle, BlockStyle } from "./styles";
import { Cursor } from "./cursor";

export type InsertOperation = {
  type: "insert";
  id: Id;
  value: string;
  parent: Id;
  side: "L" | "R";
  cursor: Cursor;
  styles?: InlineStyle[];
};

export type DeleteOperation = {
  type: "delete";
  id: Id;
  cursor: Cursor;
};

export type InlineStyleOperation = {
  type: "inline-style";
  id: Id;
  style: InlineStyle;
  value: boolean;
};

export type BlockStyleOperation = {
  type: "block-style";
  line: number;
  style: BlockStyle;
  append: boolean;
};

export type ReviveOperation = {
  type: "revive";
  id: Id;
  cursor: Cursor;
};

export type Operation =
  | InsertOperation
  | DeleteOperation
  | InlineStyleOperation
  | BlockStyleOperation
  | ReviveOperation;
