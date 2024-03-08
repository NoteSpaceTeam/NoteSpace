type Node<T> = {
  id: Id;
  value: T | null;
  isDeleted: boolean;
  parent: Id | null;
  side: 'L' | 'R';
  leftChildren: Node<T>[];
  rightChildren: Node<T>[];
  size: number;
};

export class Tree<T> {
  readonly root: Node<T>;

  // nodes by id
  readonly nodes = new Map<string, Node<T>[]>();

  constructor() {
    this.root = {
      id: { sender: '', counter: 0 },
      value: null,
      isDeleted: true,
      parent: null,
      side: 'R',
      leftChildren: [],
      rightChildren: [],
      size: 0,
    };
    this.nodes.set('', [this.root]);
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
      size: 0,
    };

    // Add to nodesByID.
    let bySender = this.nodes.get(id.sender);
    if (bySender === undefined) {
      bySender = [];
      this.nodes.set(id.sender, bySender);
    }
    bySender.push(node);

    // Insert into parent's siblings.
    this.insertIntoSiblings(node);
    this.updateSize(node, 1);
  }

  deleteNode(id: Id) {
    const node = this.getById(id);
    if (!node.isDeleted) {
      node.value = null;
      node.isDeleted = true;
      this.updateSize(node, -1);
    }
  }

  private insertIntoSiblings(node: Node<T>) {
    // Insert node among its same-side siblings, in lexicographic order by id.sender.
    // (The insertion logic guarantees we will never have same-side siblings
    // with the same sender, so there is no need to sub-order by id.counter.)
    const parent = this.getById(node.parent!);
    const siblings = node.side === 'L' ? parent.leftChildren : parent.rightChildren;
    let i = 0;
    for (; i < siblings.length; i++) {
      if (!(node.id.sender > siblings[i].id.sender)) break;
    }
    siblings.splice(i, 0, node);
  }

  /**
   * Adds delta to the sizes of node and all of its ancestors.
   */
  updateSize(node: Node<T>, delta: number) {
    for (let anc: Node<T> | null = node; anc !== null; anc = anc.parent && this.getById(anc.parent)) {
      anc.size += delta;
    }
  }

  getById(id: Id): Node<T> {
    const bySender = this.nodes.get(id.sender);
    if (bySender !== undefined) {
      const node = bySender[id.counter];
      if (node !== undefined) return node;
    }
    throw new Error('Unknown ID: ' + JSON.stringify(id));
  }
}
