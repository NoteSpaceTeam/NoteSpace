import { Id } from "./nodes";
import { Style } from "./styles";

/**
 * An insert operation.
 */
export type InsertOperation = {
  type: "insert";
  id: Id;
  value: string;
  parent: Id;
  side: "L" | "R";
  styles?: Style[];
};

/**
 * A delete operation.
 */
export type DeleteOperation = {
  type: "delete";
  id: Id;
};

/**
 * An operation to apply a style to a node.
 */
export type StyleOperation = {
  type: "style";
  id: Id;
  style: Style;
  value: boolean;
};

export type Operation = | InsertOperation | DeleteOperation | StyleOperation;
