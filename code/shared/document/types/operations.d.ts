import { Id } from "./nodes";
import { InlineStyle, BlockStyle } from "./styles";

export type InsertOperation = {
  line?: number;
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
  append: boolean;
};

export type ReviveOperation = {
  type: "revive";
  id: Id;
};

export type Operation =
  | InsertOperation
  | DeleteOperation
  | InlineStyleOperation
  | BlockStyleOperation
  | ReviveOperation;
