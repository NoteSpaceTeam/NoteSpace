import { DeleteMessage, InsertMessage, Node } from './types.ts';
import { Tree } from './tree.ts';
import { generateReplicaId } from './utils.ts';
import { socket } from '../../socket/socket.ts';

export class Fugue<T> {
  private readonly replicaId: string;
  private counter = 0;
  private readonly tree: Tree<T>;

  constructor() {
    this.replicaId = generateReplicaId();
    this.tree = new Tree();
  }

  /**
   * Builds the tree from the given nodes map.
   * @param nodesMap
   */
  setTree(nodesMap: Map<string, Node<T>[]>): void {
    this.tree.setTree(nodesMap);
  }

  /**
   * Inserts the given values starting from the given index.
   * @param start
   * @param values
   */
  insertLocal(start: number, ...values: T[]): InsertMessage<T>[] {
    return values.map((value, i) => {
      const msg = this.insertOne(start + i, value);
      this.addNode(msg);
      socket.emit('operation', msg); // FIXME: break data into data chunks - less network traffic
      return msg;
    });
  }

  /**
   * Inserts a new node in the tree based on the given message.
   * @param message - the insert message
   */
  insertRemote(message: InsertMessage<T>): void {
    this.addNode(message);
  }

  /**
   * Inserts a new node in the tree based on the given message.
   * @param start - the index where the new node should be inserted
   * @param value - the value of the new node
   * @private
   * @returns the insert message
   */
  private insertOne(start: number, value: T): InsertMessage<T> {
    const id = { sender: this.replicaId, counter: this.counter++ };
    const leftOrigin = start === 0 ? this.tree.root : this.tree.traverseBy(this.tree.root, start - 1);

    // leftOrigin has no right children, so we add the new node as a right child
    if (leftOrigin.rightChildren.length === 0) return { type: 'insert', id, value, parent: leftOrigin.id, side: 'R' };

    // Otherwise, the new node is added as a left child of rightOrigin, which
    // is the next node after leftOrigin *including tombstones*.
    // In this case, rightOrigin is the leftmost descendant of leftOrigin's
    // first right child.
    const rightOrigin = this.tree.getLeftmostDescendant(leftOrigin.rightChildren[0]);
    return { type: 'insert', id, value, parent: rightOrigin.id, side: 'L' };
  }

  /**
   * Inserts a new node in the tree based on the given message.
   * @param id
   * @param value
   * @param parent
   * @param side
   * @private
   */
  private addNode = ({ id, value, parent, side }: InsertMessage<T>) =>
    this.tree.addNode(id, value, parent, side);

  /**
   * Deletes the nodes from the given start index to the given end index.
   * @param start
   * @param end
   */
  deleteLocal(start: number, end: number): void {
    const deleteElement = (index: number) => {
      const msg = this.deleteOne(index);
      this.deleteNode(msg);
      socket.emit('operation', msg); // FIXME: this should be done only once after all the deletes - less network traffic
    };
    if (start === end) {
      deleteElement(end - 1);
      return;
    }
    for (let i = end - 1; i >= start; i--) deleteElement(i);
  }

  /**
   * Deletes the node based on the given message.
   * @param message
   */
  deleteRemote(message: DeleteMessage): void {
    this.deleteNode(message);
  }

  /**
   * Deletes the node at the given index.
   * @param index
   * @private
   * @returns the delete message
   */
  private deleteOne(index: number): DeleteMessage {
    const node = this.tree.traverseBy(this.tree.root, index);
    return { type: 'delete', id: node.id };
  }

  /**
   * Deletes the node based on the given message.
   * @param message
   * @private
   */
  private deleteNode(message: DeleteMessage): void {
    const node = this.tree.getById(message.id);
    if (!node.isDeleted) {
      node.value = null;
      node.isDeleted = true;
      this.tree.updateDepths(node, -1);
    }
  }

  /**
   * Returns the string representation of the tree.
   * @returns the string representation of the tree.
   */
  toString(): string {
    return this.tree.toString();
  }

  get depth(): number {
    return this.tree.root.depth;
  }
}
