import { Id, Node, Nodes } from "./types/nodes";
import { BlockStyle, InlineStyle } from "../types/styles";
import { isEmpty, isNull } from "lodash";
import { rootNode, treeNode } from "./utils";

export class FugueTree<T> {
  private _nodes = new Map<string, Node<T>[]>();
  private _root: Node<T>;

  constructor() {
    this._root = rootNode();
    this._nodes.set("root", [this.root]);
  }

  /**
   * Sets the tree to the given nodes
   * @param nodes
   */
  setTree(nodes: Nodes<T>) {
    const nodesMap = new Map<string, Node<T>[]>(Object.entries(nodes));
    this._nodes = nodesMap;
    this._root = nodesMap.get("root")![0];
  }

  /**
   * Adds a node to the tree
   * @param id the id of the node
   * @param value the value of the node
   * @param parent the id of the parent node
   * @param side the side of the parent node where this node is located
   * @param styles the styles of the node
   */
  addNode(
    id: Id,
    value: T,
    parent: Id,
    side: "L" | "R",
    styles?: InlineStyle[],
  ) {
    // create node
    const node = treeNode(id, value, parent, side, 0, styles);

    // add to nodes map
    const senderNodes = this.nodes.get(id.sender) || [];
    if (isEmpty(senderNodes)) this.nodes.set(id.sender, senderNodes);
    senderNodes.push(node);

    // insert into parent's siblings
    this.insertChild(node);

    // update depths of ancestors
    this.updateDepths(node, 1);
  }

  /**
   * Inserts node among its same-side siblings, in lexicographic order by id.sender.
   * @param id the id of the node.
   * @param parent the id of the parent node.
   * @param side the side of the parent node where this node is located.
   * @private
   */
  private insertChild({ id, parent, side }: Node<T>) {
    const parentNode = this.getById(parent!);
    const siblings =
      side === "L" ? parentNode.leftChildren : parentNode.rightChildren;
    let i = 0;
    for (; i < siblings.length; i++) {
      if (!(id.sender > siblings[i].sender)) break;
    }
    siblings.splice(i, 0, id);
  }

  /**
   * Deletes the node with the given id.
   * @param id
   */
  deleteNode(id: Id) {
    const node = this.getById(id);
    if (!node.isDeleted) {
      node.isDeleted = true;
    }
  }

  /**
   * Re-enables the node with the given id.
   * @param id
   */
  reviveNode(id: Id) {
    const node = this.getById(id);
    if (node.isDeleted) {
      node.isDeleted = false;
    }
  }

  /**
   * Updates the depth of the ancestors of the given node by delta.
   * @param node the node whose ancestors' depths are to be updated.
   * @param delta the amount by which to update the depths.
   */
  private updateDepths(node: Node<T>, delta: number) {
    for (
      let anc: Node<T> | null = node;
      anc !== null;
      anc = anc.parent && this.getById(anc.parent)
    ) {
      anc.depth += delta;
    }
  }

  /**
   * Returns the node with the given id.
   * @param id the id of the node.
   * @throws if the id is unknown.
   * @returns the node with the given id.
   */
  getById(id: Id): Node<T> {
    const bySender = this.nodes.get(id.sender);
    if (bySender !== undefined) {
      const node = bySender[id.counter];
      if (node) return node;
    }
    throw new Error("Unknown ID: " + JSON.stringify(id));
  }

  /**
   * Returns the leftmost left-only descendant of node, i.e., the
   * first left child of the first left child ... of node.
   *
   */
  getLeftmostDescendant(nodeId: Id): Node<T> {
    let node = this.getById(nodeId);
    while (!isEmpty(node.leftChildren)) {
      node = this.getById(node.leftChildren[0]);
    }
    return node;
  }

  /**
   * Updates the style of the node with the given id.
   * If the style is already present, it is removed; otherwise, it is added.
   * @param id
   * @param style
   * @param value
   */
  updateInlineStyle(id: Id, style: InlineStyle, value: boolean) {
    const node = this.getById(id);
    if (value) {
      if (!node.styles.includes(style)) node.styles.push(style);
    } else {
      const index = node.styles.indexOf(style);
      if (index !== -1) node.styles.splice(index, 1);
    }
  }

  updateBlockStyle(style: BlockStyle, line: number, append: boolean = false) {
    if (append) {
      this._root.styles.splice(line, 0, style);
    } else {
      this._root.styles[line] = style;
    }
  }

  /**
   * Traverses the tree in in-order traversal
   * @param root the root of the subtree.
   * @param returnDeleted
   * @returns an iterator over the nodes in the subtree.
   */
  *traverse(
    root: Node<T>,
    returnDeleted: boolean = false,
  ): IterableIterator<Node<T>> {
    let current = root;
    const stack: { side: "L" | "R"; childIndex: number }[] = [
      { side: "L", childIndex: 0 },
    ];
    while (true) {
      const top = stack[stack.length - 1];
      const children =
        top.side === "L" ? current.leftChildren : current.rightChildren;
      if (top.childIndex === children.length) {
        // We are done with the children on top.side.
        if (top.side === "L") {
          // Visit node then move to right children.
          if (current.id !== root.id && (returnDeleted || !current.isDeleted))
            yield current;
          top.side = "R";
          top.childIndex = 0;
          continue;
        }
        // Go to the parent.
        if (isNull(current.parent)) return;
        current = this.getById(current.parent);
        stack.pop();
        continue;
      }
      const child = this.getById(children[top.childIndex]);
      // Save for later that we need to visit the next child.
      top.childIndex++;
      if (child.depth > 0) {
        // Traverse child.
        current = child;
        stack.push({ side: "L", childIndex: 0 });
      }
    }
  }

  toString() {
    return Array.from(this.traverse(this.root))
      .map((node) => node.value)
      .join("");
  }

  get root(): Node<T> {
    return this._root;
  }

  get nodes() {
    return this._nodes;
  }
}
