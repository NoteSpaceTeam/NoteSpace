import { type DeleteOperation, type InsertOperation, type StyleOperation } from '@notespace/shared/crdt/types/operations';
import { type Node, type Id } from '@notespace/shared/crdt/types/nodes';
import { type Style } from '@notespace/shared/crdt/types/styles';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import { generateReplicaId } from './utils';
import { socket } from '@src/socket/socket';
import { type InsertNode } from '@editor/crdt/types';
import {Cursor, Selection} from '@editor/slate/model/cursor'
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
  insertLocal({start}: Selection, ...values: InsertNode[]): InsertOperation[] {
    return values.map((value, i) => {
      const operation = this.insertOne({...start, column: start.column + i}, value);
      this.addNode(operation);
      socket.emit('operation', operation); // FIXME: break data into data chunks - less network traffic
      return operation;
    });
  }

  /**
   * Inserts a new node in the tree based on the given operation.
   * @param operation - the insert operation
   */
  insertRemote(operation: InsertOperation): void {
    this.addNode(operation);
  }

  /**
   * Inserts a new node in the tree based on the given operation.
   * @param start - the index where the new node should be inserted
   * @param value - the value of the new node
   * @param styles
   * @private
   * @returns the insert operation
   */
  private insertOne({ line, column } : Cursor, { value, styles }: InsertNode): InsertOperation {
    const id = { sender: this.replicaId, counter: this.counter++ };

    const root = this.findNode('\n', line) || this.tree.root;

    const leftOrigin = column === 0 ? root : this.tree.getByIndex(root, column - 1);
  
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

    const rightOrigin = this.tree.getLeftmostDescendant(leftOrigin.rightChildren[0]);
    return { type: 'insert', id, value, parent: rightOrigin.id, side: 'L' };
  }


  /**
   * Inserts a new node in the tree based on the given operation.
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
  deleteLocal({start, end} : Selection): void {
    const deleteElement = (id : Id) => {
      const msg = this.deleteOne(id);
      this.deleteNode(msg);
      socket.emit('operation', msg); // FIXME: this should be done only once after all the deletes - less network traffic
    };

    const startRoot = this.findNode('\n', start.line);
    const startNode = this.tree.getByIndex(startRoot, start.column);

    const endRoot = this.findNode('\n', end.line);
    const endNode = this.tree.getByIndex(endRoot, end.column);

    for (const node of this.tree.traverse(startNode)){
      if (node === endNode) break;
      deleteElement(node.id);
    }
  }

  /**
   * Deletes the node based on the given operation.
   * @param operation
   */
  deleteRemote(operation: DeleteOperation): void {
    this.deleteNode(operation);
  }

  /**
   * Returns the delete operation
   * @param index
   * @private
   * @returns the delete operation
   */
  private deleteOne(id : Id): DeleteOperation {
    return { type: 'delete', id };
  }

  /**
   * Deletes the node based on the given operation.
   * @param operation
   * @private
   */
  private deleteNode({id}: DeleteOperation): void {
    this.tree.deleteNode(id);
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
  traverseTree = () => this.tree.traverse(this.tree.root);

  findNode(value: string, skip: number): Node<string> {
    let lastMatch: Node<string> = this.tree.root
    for (const node of this.traverseTree()){
      if(node.value === value && !node.isDeleted) {
        lastMatch = node
        if (--skip === 0) return lastMatch
      }
    }
    return lastMatch
  }


  /**
   * Returns the string representation of the tree.
   * @returns the string representation of the tree.
   */
  toString(): string {
    const values: string[] = [];
    for (const node of this.traverseTree()) {
      values.push(node.value!);
    }
    return values.join('');
  }

  getElementId(index: number): Id {
    return this.tree.getByIndex(this.tree.root, index).id;
  }
}
