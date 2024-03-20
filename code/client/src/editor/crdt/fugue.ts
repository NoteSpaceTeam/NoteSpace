import { DeleteOperation, Id, InsertOperation, Node, Style, StyleOperation } from '@notespace/shared/crdt/types';
import { FugueTree } from '@notespace/shared/crdt/FugueTree.ts';
import { generateReplicaId } from './utils';
import { socket } from '@src/socket/socket.ts';
import { Descendant } from 'slate';
import { CustomElement, CustomText } from '@src/editor/slate/model/types.ts';

/**
 * A local replica of a FugueTree.
 * @param T - the type of the values stored in the tree
 * @class
 * @property {string} replicaId - the id of the replica
 */
export class Fugue<T> {
  private readonly replicaId: string;
  private counter = 0;
  private readonly tree: FugueTree<T>;

  constructor() {
    this.replicaId = generateReplicaId();
    this.tree = new FugueTree();
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
  insertLocal(start: number, ...values: T[]): InsertOperation<T>[] {
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
  insertRemote(message: InsertOperation<T>): void {
    this.addNode(message);
  }

  /**
   * Inserts a new node in the tree based on the given message.
   * @param start - the index where the new node should be inserted
   * @param value - the value of the new node
   * @private
   * @returns the insert message
   */
  private insertOne(start: number, value: T): InsertOperation<T> {
    const id = { sender: this.replicaId, counter: this.counter++ };
    const leftOrigin = start === 0 ? this.tree.root : this.tree.traverseByIndex(this.tree.root, start - 1);

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
  private addNode({ id, value, parent, side }: InsertOperation<T>) {
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
    const node = this.tree.traverseByIndex(this.tree.root, index);
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

  updateStyle({ id, style }: StyleOperation): void {
    this.tree.updateStyle(id, style);
  }

  /**
   * Returns the string representation of the tree.
   * @returns the string representation of the tree.
   */
  toString(): string {
    const values: T[] = [];
    for (const node of this.tree.traverse(this.tree.root)) {
      values.push(node.value!);
    }
    return values.join('');
  }

  /**
   * Returns the slate representation of the tree.
   * @returns the slate representation of the tree.
   */
  toSlate(): Descendant[] {
    const descendants: Descendant[] = [];
    let lastStyles: Style[] | null = null;
    for (const node of this.tree.traverse(this.tree.root)) {
      if (node.isDeleted) continue;
      const textNode: CustomText = {
        text: node.value as string,
        bold: node.styles.includes('bold'),
        italic: node.styles.includes('italic'),
        underline: node.styles.includes('underline'),
        strikethrough: node.styles.includes('strikethrough'),
        code: node.styles.includes('code'),
      };
      const lastDescendant = descendants[descendants.length === 0 ? 0 : descendants.length - 1];
      if (lastDescendant !== undefined) {
        if (lastStyles?.every(s => node.styles.includes(s))) {
          const lastTextNode = lastDescendant.children[lastDescendant.children.length - 1];
          lastTextNode.text += textNode.text;
        } else {
          lastDescendant.children.push(textNode);
        }
      } else {
        const paragraph: CustomElement = {
          type: 'paragraph',
          children: [textNode],
        };
        descendants.push(paragraph);
      }
      lastStyles = node.styles;
    }

    if (descendants.length === 0) {
      const paragraph: CustomElement = {
        type: 'paragraph',
        children: [{ text: '' }],
      };
      descendants.push(paragraph);
    }
    return descendants;
  }

  getElementId(index: number): Id {
    return this.tree.traverseByIndex(this.tree.root, index).id;
  }
}
