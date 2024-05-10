import { Node, Id, RootNode } from "./types/nodes";
import { InlineStyle } from "../domain/styles";

export function rootNode<T>(): RootNode<T> {
  return {
    id: { sender: "root", counter: 0 },
    value: [],
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
  parent: Id | null,
  side: "L" | "R",
  depth: number,
  styles: InlineStyle[] = [],
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
}
