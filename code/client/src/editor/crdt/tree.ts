import { Id, Node } from './types.ts';

export class Tree<T> {
  // nodes mapping by id
  private readonly nodes = new Map<string, Node<T>[]>();
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
      size: 0,
    };
    this.nodes.set('', [this.root]);
  }

  setTree(root: Node<T>) {
    this.root = root;
    this.buildNodesMap();
  }

  private buildNodesMap() {
    // Clear the existing map
    this.nodes.clear();

    // Traverse the tree and populate the nodes map
    const stack: Node<T>[] = [this.root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node) {
        // Add the current node to the map
        let bySender = this.nodes.get(node.id.sender);
        if (!bySender) {
          bySender = [];
          this.nodes.set(node.id.sender, bySender);
        }
        bySender.push(node);

        // Push the children onto the stack for further processing
        for (const child of node.leftChildren.concat(node.rightChildren)) {
          stack.push(child);
        }
      }
    }
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

    // Add to nodes map
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

  /**
   * Returns the node at the given index within node's subtree.
   */
  getByIndex(node: Node<T>, index: number): Node<T> {
    if (index < 0 || index >= node.size) {
      throw new Error('Index out of range: ' + index + ' (size: ' + node.size + ')');
    }

    // A recursive approach would be simpler, but overflows the stack at modest
    // depths (~4000). So we do an iterative approach instead.
    let remaining = index;
    // eslint-disable-next-line no-constant-condition
    recurse: while (true) {
      for (const child of node.leftChildren) {
        if (remaining < child.size) {
          node = child;
          continue recurse;
        }
        remaining -= child.size;
      }
      if (!node.isDeleted) {
        if (remaining === 0) return node;
        remaining--;
      }
      for (const child of node.rightChildren) {
        if (remaining < child.size) {
          node = child;
          continue recurse;
        }
        remaining -= child.size;
      }
      throw new Error('Index in range but not found');
    }
  }

  /**
   * Returns the leftmost left-only descendant of node, i.e., the
   * first left child of the first left child ... of node.
   */
  leftmostDescendant(node: Node<T>): Node<T> {
    let desc = node;
    for (; desc.leftChildren.length !== 0; desc = desc.leftChildren[0]) {
      /* empty */
    }
    return desc;
  }

  *traverse(node: Node<T>): IterableIterator<T> {
    // A recursive approach (like in the paper) would be simpler,
    // but overflows the stack at modest
    // depths (~4000). So we do an iterative approach instead.

    let current = node;
    // Stack records the next child to visit for that node.
    // We don't need to store node because we can infer it from the
    // current node's parent etc.
    const stack: { side: 'L' | 'R'; childIndex: number }[] = [{ side: 'L', childIndex: 0 }];
    while (true) {
      const top = stack[stack.length - 1];
      const children = top.side === 'L' ? current.leftChildren : current.rightChildren;
      if (top.childIndex === children.length) {
        // We are done with the children on top.side.
        if (top.side === 'L') {
          // Visit us, then move to right children.
          if (!current.isDeleted) yield current.value!;
          top.side = 'R';
          top.childIndex = 0;
        } else {
          // Go to the parent.
          if (current.parent === null) return;
          current = this.getById(current.parent);
          stack.pop();
        }
      } else {
        const child = children[top.childIndex];
        // Save for later that we need to visit the next child.
        top.childIndex++;
        if (child.size > 0) {
          // Traverse child.
          current = child;
          stack.push({ side: 'L', childIndex: 0 });
        }
      }
    }
  }
}
