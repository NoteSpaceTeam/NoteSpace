import { Id, Node } from './types.ts';

export class Tree<T> {
  // nodes mapping by id
  private nodes = new Map<string, Node<T>[]>();
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

  setTree(nodes: Map<string, Node<T>[]>) {
    this.nodes = nodes;
    this.root = this.buildTree(nodes);
    this.buildNodesMap();
  }

  buildTree<T>(nodes: Map<string, Node<T>[]>): Node<T> {
    const getChildren = (node: Node<T>, side: 'L' | 'R'): Node<T>[] => {
      return Array.from(nodes.values()).flatMap(nodeArray =>
        nodeArray.filter(
          n => n.parent?.sender === node.id.sender && n.parent?.counter === node.id.counter && n.side === side
        )
      );
    };

    // get size of non deleted children recursively
    const getSize = (node: Node<T>): number => {
      return (
        1 +
        getChildren(node, 'L').reduce((acc, n) => acc + getSize(n), 0) +
        getChildren(node, 'R').reduce((acc, n) => acc + getSize(n), 0)
      );
    };

    function buildSubtree(nodeId: Id): Node<T> | null {
      const node = nodes.get(nodeId.sender)?.[nodeId.counter];
      if (!node) return null;

      // get children
      const leftChildren = getChildren(node, 'L').map(n => n.id);
      const rightChildren = getChildren(node, 'R').map(n => n.id);

      // return the current node
      return {
        ...node,
        leftChildren,
        rightChildren,
        size: getSize(node) - 1,
      };
    }
    const rootNode = nodes.get('')![0];
    return buildSubtree(rootNode.id)!;
  }

  private buildNodesMap() {
    this.nodes.set(this.root.id.sender, [this.root]);
    for (const node of this.traverse(this.root)) {
      let bySender = this.nodes.get(node.id.sender);
      if (bySender === undefined) {
        bySender = [];
        this.nodes.set(node.id.sender, bySender);
      }
      bySender.push(node);
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
      if (!(node.id.sender > siblings[i].sender)) break;
    }
    siblings.splice(i, 0, node.id);
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
      for (const childId of node.leftChildren) {
        const child = this.getById(childId);
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
      for (const childId of node.rightChildren) {
        const child = this.getById(childId);
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
  leftmostDescendant(node: Id): Node<T> {
    let desc = this.getById(node);
    for (; desc.leftChildren.length !== 0; desc = this.getById(desc.leftChildren[0])) {
      /* empty */
    }
    return desc;
  }

  *traverse(node: Node<T>): IterableIterator<Node<T>> {
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
          if (!current.isDeleted) yield current;
          top.side = 'R';
          top.childIndex = 0;
        } else {
          // Go to the parent.
          if (current.parent === null) return;
          current = this.getById(current.parent);
          stack.pop();
        }
      } else {
        const child = this.getById(children[top.childIndex]);
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
