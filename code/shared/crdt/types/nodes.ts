import { Style } from "../../types/styles";

export type Id = {
  sender: string;
  counter: number;
};

/**
 * A node in the tree.
 * @param T the type of the value stored in the node.
 * @param id the id of the node.
 * @param value the value stored in the node.
 * @param isDeleted whether the node is deleted.
 * @param parent the id of the parent node.
 * @param side the side of the parent node where this node is located.
 * @param leftChildren the ids of the left children.
 * @param rightChildren the ids of the right children.
 * @param depth the depth of the node in the tree.
 */
export type Node<T> = {
  id: Id;
  value: T | null;
  isDeleted: boolean;
  parent: Id | null;
  side: "L" | "R";
  leftChildren: Id[];
  rightChildren: Id[];
  depth: number;
  styles: Style[];
};

export type Nodes<T> = Record<string, Node<T>[]>;
