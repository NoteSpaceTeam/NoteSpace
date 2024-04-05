import { Id } from "./nodes";
import { InlineStyle, BlockStyle } from "../../types/styles";

export type InsertOperation = {
  type: "insert";
  id: Id;
  value: string;
  parent: Id;
  side: "L" | "R";
  styles?: InlineStyle[];
};

export type DeleteOperation = {
  type: "delete";
  id: Id;
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
};

export type GlobalOperation = {
  type: "global";
  operation: "undo" | "redo";
};

export type Operation =
  | InsertOperation
  | DeleteOperation
  | InlineStyleOperation
  | BlockStyleOperation
  | GlobalOperation;
