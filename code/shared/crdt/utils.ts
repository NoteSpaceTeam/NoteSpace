import { Node, Id } from "./types/nodes"
import { InlineStyle, BlockStyle } from "./types/styles";

export function rootNode<T>(): Node<T> {
  return {
    id: { sender: "root", counter: 0 },
    value: null,
    isDeleted: true,
    parent: null,
    side: "R",
    leftChildren: [],
    rightChildren: [],
    depth: 0,
    styles: [],
  };
}

export function treeNode<T>(
  id: Id, 
  value: T, 
  parent: Id, 
  side: 'L' | 'R', 
  depth: number, 
  styles: InlineStyle[] = []
): Node<T> {
  return {
    id,
    value,
    parent,
    side,
    isDeleted: false,
    leftChildren: [],
    rightChildren: [],
    depth,
    styles,
  };
};