import { type DeleteOperation, type InsertOperation, type StyleOperation } from '@notespace/shared/crdt/operations';
import { type Node, type Id } from '@notespace/shared/crdt/types';
import { type Style } from '@notespace/shared/crdt/styles';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import { generateReplicaId } from './utils';
import { socket } from '@src/socket/socket';
import { type InsertNode } from '@editor/crdt/types';
import { isEmpty } from 'lodash';

/**
 * A local replica of a FugueTree.
 * @param T - the type of the values stored in the tree
 * @class
 * @property {string} replicaId - the id of the replica
 */
export class Fugue {
  private readonly replicaId: string;
  private counter = 0;
  private readonly tree: FugueTree<string>;

  constructor() {
    this.replicaId = generateReplicaId();
    this.tree = new FugueTree();
  }

  /**
   * Builds the tree from the given nodes map.
   * @param nodesMap
   */
  setTree(nodesMap: Map<string, Node<string>[]>): void {
    this.tree.setTree(nodesMap);
  }

  /**
   * Inserts the given values starting from the given index.
   * @param start
   * @param values
   */
  insertLocal(start: number, ...values: InsertNode[]): InsertOperation[] {
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
  insertRemote(message: InsertOperation): void {
    this.addNode(message);
  }

  /**
   * Inserts a new node in the tree based on the given message.
   * @param start - the index where the new node should be inserted
   * @param value - the value of the new node
   * @param styles
   * @private
   * @returns the insert message
   */
  private insertOne(start: number, { value, styles }: InsertNode): InsertOperation {
    const id = { sender: this.replicaId, counter: this.counter++ };
    const leftOrigin = start === 0 ? this.tree.root : this.tree.getByIndex(this.tree.root, start - 1);
    // leftOrigin has no right children, so we add the new node as a right child
    if (isEmpty(leftOrigin.rightChildren)) {
      return {
        type: 'insert',
        id,
        value,
        parent: leftOrigin.id,
        side: 'R',
        styles,
      };
    }
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
  private addNode({ id, value, parent, side }: InsertOperation) {
    this.tree.addNode(id, value, parent, side);
  }

  /**
   * Deletes the nodes from the given start index to the given end index.
   * @param start
   * @param end (exclusive)
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
  deleteRemote(message: DeleteOperation): void {
    this.deleteNode(message);
  }

  /**
   * Deletes the node at the given index.
   * @param index
   * @private
   * @returns the delete message
   */
  private deleteOne(index: number): DeleteOperation {
    const node = this.tree.getByIndex(this.tree.root, index);
    return { type: 'delete', id: node.id };
  }

  /**
   * Deletes the node based on the given message.
   * @param message
   * @private
   */
  private deleteNode(message: DeleteOperation): void {
    this.tree.deleteNode(message.id);
  }

  updateStyleLocal(start: number, end: number, value: boolean, format: string) {
    for (let i = start; i < end; i++) {
      const id = this.getElementId(i);
      if (!id) continue;
      const style = format as Style;
      const styleOperation: StyleOperation = {
        type: 'style',
        id,
        style: style,
        value: value,
      };
      this.tree.updateStyle(id, style, value);
      // TODO: swap to chunked operations
      socket.emit('operation', styleOperation);
    }
  }

  updateStyleRemote({ id, style, value }: StyleOperation): void {
    this.tree.updateStyle(id, style, value);
  }

  /**
   * Makes a full traversal of the tree.
   */
  fullTraverse = () => this.tree.traverse(this.tree.root);

  /**
   * Returns the string representation of the tree.
   * @returns the string representation of the tree.
   */
  toString(): string {
    const values: string[] = [];
    for (const node of this.fullTraverse()) {
      values.push(node.value!);
    }
    return values.join('');
  }

  getElementId(index: number): Id {
    return this.tree.getByIndex(this.tree.root, index).id;
  }
}
