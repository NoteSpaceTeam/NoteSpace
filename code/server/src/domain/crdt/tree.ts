type Node<T> = {
  id: Id;
  value: T | null;
  isDeleted: boolean;
  parent: Id | null;
  side: 'L' | 'R';
  leftChildren: Id[];
  rightChildren: Id[];
  depth: number;
};

export class Tree<T> {
  // nodes mapping by id
  readonly nodesMap = new Map<string, Node<T>[]>();
  public root: Node<T>;

  constructor() {
    this.root = {
      id: { sender: '', counter: 0 },
      value: null,
      isDeleted: true,
      parent: null,
      side: 'R',
      leftChildren: [],
      rightChildren: [],
      depth: 0,
    };
    this.nodesMap.set('', [this.root]);
  }

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
    };

    // Add to nodes map
    const senderNodes = this.nodesMap.get(id.sender) || [];
    if (senderNodes.length === 0) this.nodesMap.set(id.sender, senderNodes);
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
  private insertChild({id, parent, side}: Node<T>) {
    const parentNode = this.getById(parent!);
    const siblings = side === 'L' ? parentNode.leftChildren : parentNode.rightChildren;
    let i = 0;
    for (; i < siblings.length; i++) {
      if (!(id.sender > siblings[i].sender)) break;
    }
    siblings.splice(i, 0, id);
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
    const bySender = this.nodesMap.get(id.sender);
    if (bySender !== undefined) {
      const node = bySender[id.counter];
      if (node !== undefined) return node;
    }
    throw new Error('Unknown ID: ' + JSON.stringify(id));
  }

  deleteNode(id: Id): void {
    const node = this.getById(id);
    if (!node.isDeleted) {
      node.value = null;
      node.isDeleted = true;
      this.updateDepths(node, -1);
    }
  }
}
