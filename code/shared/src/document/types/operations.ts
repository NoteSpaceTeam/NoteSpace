import { Id } from "./types";
import { InlineStyle, BlockStyle } from "./styles";

export type InsertOperation = {
  type: "insert";
  id: Id;
  value: string;
  parent: Id;
  side: "L" | "R";
  styles?: InlineStyle[];
  line: number;
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

export type Operation =
  | InsertOperation
  | DeleteOperation
  | InlineStyleOperation
  | BlockStyleOperation;
