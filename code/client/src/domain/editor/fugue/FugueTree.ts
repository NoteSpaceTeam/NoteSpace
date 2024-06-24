import { Node, Nodes } from '@domain/editor/fugue/nodes';
import { BlockStyle, InlineStyle } from '@notespace/shared/src/document/types/styles';
import { Id } from '@notespace/shared/src/document/types/types';
import { rootNode, treeNode } from '@domain/editor/fugue/utils';

import { RootNode, NodeType } from '@domain/editor/fugue/nodes';

export class FugueTree<T> {
  /* Holds the root node of the tree.
    Root node is a special node that holds the root of the tree and the following information:
    - All line's root nodes
    - All line's block styles
  * */
  private _root: RootNode<T>;

  /* Holds all the nodes in the tree.
     The key is the sender id and the value is an array of nodes sent by that sender
  */
  private _nodes = new Map<string, NodeType<T>[]>();

  constructor() {
    this._root = rootNode();
    this._nodes.set('root', [this._root]);
  }

  /**
   * Adds a node to the tree
   * @param id the id of the node
   * @param value the value of the node
   * @param parent the id of the parent node
   * @param side the side of the parent node where this node is located
   * @param styles the styles of the node
   */
  addNode(id: Id, value: T, parent: Id | null, side: 'L' | 'R', styles?: InlineStyle[] | BlockStyle[]) {
    // create node
    const node = treeNode(id, value, parent, side, 0, styles as InlineStyle[]);
    this._addNode(node);
  }

  /**
   * Adds a line root node to the tree.
   * @param line
   * @param id
   * @param parent
   * @param side
   * @param styles
   */
  addLineRoot(line: number, id: Id, parent: Id, side: 'L' | 'R', styles?: InlineStyle[]) {
    const node = treeNode(id, '\n', parent, side, 0, styles) as Node<T>;

    this._root.value.splice(line, 0, node);

    this._addNode(node);
  }

  /**
   * Internal method to add a node to the tree.
   * @param node
   */
  _addNode(node: Node<T>) {
    // add to nodes map
    const { id } = node;
    const senderNodes = this.nodes.get(id.sender) || [];
    if (senderNodes.length === 0) this.nodes.set(id.sender, senderNodes);
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
    const siblings = side === 'L' ? parentNode.leftChildren : parentNode.rightChildren;
    let i = 0;
    while (i < siblings.length) if (!(id.sender > siblings[i++].sender)) break;

    siblings.splice(i, 0, id);
    siblings.sort((a, b) => a.sender.localeCompare(b.sender));
  }

  /**
   * Deletes the node with the given id.
   * @param id
   */
  deleteNode(id: Id) {
    const node = this.getById(id);

    // Update line root at the root node with
    if (!node.isDeleted) node.isDeleted = true;
    if (node.value === '\n') {
      const idx = this._root.value.findIndex(n => n.id === id);
      this._root.value[idx].isDeleted = true;
    }
  }

  /**
   * Updates the depth of the ancestors of the given node by delta.
   * @param node the node whose ancestors' depths are to be updated.
   * @param delta the amount by which to update the depths.
   */
  private updateDepths(node: NodeType<T>, delta: number) {
    for (let anc: NodeType<T> | null = node; anc !== null; anc = anc.parent && this.getById(anc.parent)) {
      anc.depth += delta;
    }
  }

  /**
   * Returns the node with the given id.
   * @param id the id of the node.
   * @throws if the id is unknown.
   * @returns the node with the given id.
   */
  getById(id: Id): NodeType<T> {
    const bySender = this.nodes.get(id.sender);
    if (bySender !== undefined) {
      const node = bySender[id.counter];
      if (node) return node;
    }
    throw new Error('Unknown ID: ' + JSON.stringify(id));
  }

  getLineRoot(line: number): NodeType<T> {
    return line === 0 ? this._root : this._root.value[line - 1];
  }

  setTree(nodes: Nodes<T>) {
    this._nodes = new Map(Object.entries(nodes));
  }

  clear() {
    this._root = rootNode();
    this._nodes.clear();
    this._nodes.set('root', [this._root]);
  }

  /**
   * Returns the leftmost left-only descendant of node, i.e., the
   * first left child of the first left child ... of node.
   *
   */
  getLeftmostDescendant(nodeId: Id): NodeType<T> {
    let node = this.getById(nodeId);
    while (node.leftChildren.length !== 0) {
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
      return;
    }
    const index = node.styles.indexOf(style);
    if (index !== -1) node.styles.splice(index, 1);
  }

  updateBlockStyle(style: BlockStyle, line: number, append: boolean = false) {
    if (append) {
      this._root.styles.splice(line, 0, style);
      return;
    }
    this._root.styles[line] = style;
  }

  /**
   * Traverses the tree in in-order traversal
   * @param root the root of the subtree.
   * @param returnDeleted
   * @returns an iterator over the nodes in the subtree.
   */
  *traverse(root: NodeType<T>, returnDeleted: boolean = false): IterableIterator<NodeType<T>> {
    let current = root;
    const stack: { side: 'L' | 'R'; childIndex: number }[] = [{ side: 'L', childIndex: 0 }];
    while (true) {
      const top = stack[stack.length - 1];
      if (!top) return;
      const children = top.side === 'L' ? current.leftChildren : current.rightChildren;
      if (top.childIndex === children.length) {
        // We are done with the children on top.side.
        if (top.side === 'L') {
          // Visit node then move to right children. If the node is deleted, skip it if returnDeleted is false.
          if (current.id !== root.id && (returnDeleted || !current.isDeleted)) yield current;
          top.side = 'R';
          top.childIndex = 0;
          continue;
        }
        // Go to the parent.
        if (current.parent === null) return;
        current = this.getById(current.parent as Id);
        stack.pop();
        continue;
      }
      const child = this.getById(children[top.childIndex]);
      // Save for later that we need to visit the next child.
      top.childIndex++;
      if (child.depth > 0) {
        // Traverse child.
        current = child;
        stack.push({ side: 'L', childIndex: 0 });
      }
    }
  }

  toString() {
    return Array.from(this.traverse(this._root))
      .map(node => node.value)
      .join('');
  }

  get root(): RootNode<T> {
    return this._root;
  }

  get nodes() {
    return this._nodes;
  }
}
