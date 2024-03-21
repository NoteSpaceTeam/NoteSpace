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
  side: 'L' | 'R';
  leftChildren: Id[];
  rightChildren: Id[];
  depth: number;
  styles: Style[]
};

export type Nodes<T> = Record<string, Node<T>[]>;

export type Style = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code';

/**
 * An insert operation.
 */
export type InsertOperation<T> = {
  type: 'insert';
  id: Id;
  value: T;
  parent: Id;
  side: 'L' | 'R';
  styles?: Style[];
};

/**
 * A delete operation.
 */
export type DeleteOperation = {
  type: 'delete';
  id: Id;
};

/**
 * An operation to apply a style to a node.
 */
export type StyleOperation = {
  type: 'style';
  id: Id;
  style: Style;
};

export type Operation = InsertOperation<string> | DeleteOperation | StyleOperation;