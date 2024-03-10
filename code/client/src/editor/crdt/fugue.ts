import { DeleteMessage, InsertMessage, Node } from './types.ts';
import { Tree } from './tree.ts';
import { generateRandomReplicaId } from './utils.ts';
import { socket } from '../../socket/socket.ts';

export class Fugue<T> {
  private readonly replicaId: string;
  private counter = 0;
  private readonly tree: Tree<T>;

  constructor() {
    this.replicaId = generateRandomReplicaId();
    this.tree = new Tree();
  }

  setTree(nodes: Map<string, Node<T>[]>): void {
    this.tree.setTree(nodes);
  }

  insertLocal(index: number, ...values: T[]): InsertMessage<T>[] {
    return values.map((value, i) => {
      const msg = this.insertOne(index + i, value);
      this.addNode(msg);
      socket.emit('operation', msg);
      return msg;
    });
  }

  insertRemote(message: InsertMessage<T>): void {
    this.addNode(message);
  }

  private insertOne(index: number, value: T): InsertMessage<T> {
    const id = { sender: this.replicaId, counter: this.counter++ };
    const leftOrigin = index === 0 ? this.tree.root : this.tree.getByIndex(this.tree.root, index - 1);

    if (leftOrigin.rightChildren.length === 0) {
      // leftOrigin has no right children, so the new node becomes
      // a right child of leftOrigin.
      return { type: 'insert', id, value, parent: leftOrigin.id, side: 'R' };
    } else {
      // Otherwise, the new node is added as a left child of rightOrigin, which
      // is the next node after leftOrigin *including tombstones*.
      // In this case, rightOrigin is the leftmost descendant of leftOrigin's
      // first right child.
      const rightOrigin = this.tree.leftmostDescendant(leftOrigin.rightChildren[0]);
      return { type: 'insert', id, value, parent: rightOrigin.id, side: 'L' };
    }
  }

  private addNode({ id, value, parent, side }: InsertMessage<T>): void {
    this.tree.addNode(id, value, parent, side);
  }

  deleteLocal(startIndex: number, endIndex: number): void {
    const deleteElement = (index: number) => {
      const msg = this.deleteOne(index);
      this.deleteNode(msg);
      socket.emit('operation', msg);
    };
    if (startIndex === endIndex) {
      deleteElement(endIndex);
      return;
    }
    for (let i = endIndex - 1; i >= startIndex; i--) {
      deleteElement(i);
    }
  }

  deleteRemote(message: DeleteMessage): void {
    this.deleteNode(message);
  }

  private deleteOne(index: number): DeleteMessage {
    const node = this.tree.getByIndex(this.tree.root, index);
    return { type: 'delete', id: node.id };
  }

  private deleteNode(message: DeleteMessage): void {
    const node = this.tree.getById(message.id);
    if (!node.isDeleted) {
      node.value = null;
      node.isDeleted = true;
      this.tree.updateSize(node, -1);
    }
  }

  get(index: number): T {
    if (index < 0 || index >= this.length) {
      throw new Error('index out of bounds: ' + index);
    }
    const node = this.tree.getByIndex(this.tree.root, index);
    return node.value!;
  }

  toString(): string {
    const iterator = this.tree.traverse(this.tree.root);
    const values: T[] = [];
    for (let node = iterator.next(); !node.done; node = iterator.next()) {
      values.push(node.value.value!);
    }
    return values.join('');
  }

  get length(): number {
    return this.tree.root.size;
  }
}
