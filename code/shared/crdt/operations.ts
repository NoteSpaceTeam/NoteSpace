import { Id } from "./types";
import { Style } from "./styles";

/**
 * An insert operation.
 */
export type InsertOperation<T> = {
  type: "insert";
  id: Id;
  value: T;
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
};

export type Operation<T> =
  | InsertOperation<T>
  | DeleteOperation
  | StyleOperation;
