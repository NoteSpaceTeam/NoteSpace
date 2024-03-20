import {Id, Node, Style} from './types';

export class FugueTree<T> {

  private _nodes = new Map<string, Node<T>[]>();
  private _root: Node<T>;

  constructor() {
    this._root = {
      id: { sender: 'root', counter: 0 },
      value: null,
      isDeleted: true,
      parent: null,
      side: 'R',
      leftChildren: [],
      rightChildren: [],
      depth: 0,
      styles: [],
    };
    this._nodes.set('root', [this.root]);
  }

  /**
   * Sets the tree to the given nodes.
   * @param nodesMap the nodes.
   */
  setTree(nodesMap: Map<string, Node<T>[]>) {
    this._nodes = nodesMap;
    this._root = nodesMap.get('root')![0];
  }

  /**
   * Adds a node to the tree.
   * @param id the id of the node.
   * @param value the value of the node.
   * @param parent the id of the parent node.
   * @param side the side of the parent node where this node is located.
   */
  addNode(id: Id, value: T, parent: Id, side: 'L' | 'R') {
    const node: Node<T> = {
      id,
      value,
      isDeleted: false,
      parent,
      side,
      leftChildren: [],
      rightChildren: [],
      depth: 0,
      styles: [],
    };
    // Add to nodes map
    const senderNodes = this.nodes.get(id.sender) || [];
    if (senderNodes.length === 0) this.nodes.set(id.sender, senderNodes);
    senderNodes.push(node);
    // Insert into parent's siblings.
    this.insertChild(node);
    // Update sizes of ancestors
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
    for (; i < siblings.length; i++) {
      if (!(id.sender > siblings[i].sender)) break;
    }
    siblings.splice(i, 0, id);
  }

  deleteNode(id: Id) {
    const node = this.getById(id);
    if (!node.isDeleted) {
      node.value = null;
      node.isDeleted = true;
      this.updateDepths(node, -1);
    }
  }

  /**
   * Updates the depth of the ancestors of the given node by delta.
   * @param node the node whose ancestors' depths are to be updated.
   * @param delta the amount by which to update the depths.
   */
  updateDepths(node: Node<T>, delta: number) {
    for (let anc: Node<T> | null = node; anc !== null; anc = anc.parent && this.getById(anc.parent)) {
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
      if (node !== undefined) return node;
    }
    throw new Error('Unknown ID: ' + JSON.stringify(id));
  }

  /**
   * Returns the leftmost left-only descendant of node, i.e., the
   * first left child of the first left child ... of node.
   *
   */
  getLeftmostDescendant(nodeId: Id): Node<T> {
    let node = this.getById(nodeId);
    for (; node.leftChildren.length !== 0; node = this.getById(node.leftChildren[0])) {
      /* empty */
    }
    return node;
  }

  /**
   * Updates the style of the node with the given id.
   * If the style is already present, it is removed; otherwise, it is added.
   * @param id
   * @param style
   */
  updateStyle(id: Id, style: Style) {
    const node = this.getById(id);
    const index = node.styles.indexOf(style);
    if (index === -1) {
      node.styles.push(style);
    } else {
      node.styles.splice(index, 1);
    }
  }

  /**
   * Traverses the tree by the given number of depth-first steps and returns the node at that position.
   * @param node the root of the subtree.
   * @param index the number of depth-first steps to take.
   * @throws if the index is out of range.
   */
  traverseByIndex(node: Node<T>, index: number): Node<T> {
    if (index < 0 || index >= node.depth) throw new Error(`Invalid index: ${index}`);
    let remaining = index;
    let continueLoop = true;
    while (continueLoop) {
      continueLoop = false;
      // 1 - Iterate over left children first
      for (const childId of node.leftChildren) {
        const child = this.getById(childId);
        if (remaining < child.depth) {
          node = child;
          continueLoop = true;
          break;
        }
        remaining -= child.depth;
      }
      if (continueLoop) continue;
      // 2 - If no left children, visit the current node
      if (!node.isDeleted) {
        if (remaining === 0) return node;
        remaining--;
      }
      // 3 - Iterate over right children
      for (const childId of node.rightChildren) {
        const child = this.getById(childId);
        if (remaining < child.depth) {
          node = child;
          continueLoop = true;
          break;
        }
        remaining -= child.depth;
      }
    }
    throw new Error(`No node found at node: ${node.id} with index: ${index}`);
  }

  /**
   * Traverses the tree in depth-first order.
   * @param root the root of the subtree.
   * @returns an iterator over the nodes in the subtree.
   */
  *traverse(root: Node<T>): IterableIterator<Node<T>> {
    let current = root;
    const stack: { side: 'L' | 'R'; childIndex: number }[] = [{ side: 'L', childIndex: 0 }];
    while (true) {
      const top = stack[stack.length - 1];
      const children = top.side === 'L' ? current.leftChildren : current.rightChildren;
      if (top.childIndex === children.length) {
        // We are done with the children on top.side.
        if (top.side === 'L') {
          // Visit node then move to right children.
          if (!current.isDeleted) yield current;
          top.side = 'R';
          top.childIndex = 0;
          continue;
        }
        // Go to the parent.
        if (current.parent === null) return;
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
        stack.push({ side: 'L', childIndex: 0 });
      }
    }
  }

  get root(): Node<T> {
    return this._root;
  }

  get nodes() {
    return this._nodes;
  }
}
