import {
  type DeleteOperation,
  type InsertOperation,
  type StyleOperation,
} from '@notespace/shared/crdt/types/operations';
import { type Node, type Id } from '@notespace/shared/crdt/types/nodes';
import { type Style } from '../../../../shared/types/styles';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import { chunkData, generateReplicaId } from './utils';
import { socket } from '@src/socket/socket';
import { type InsertNode } from '@editor/crdt/types';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { isEmpty, isEqual } from 'lodash';

const CHUNK_DATA_SIZE = 50;

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
  insertLocal(start: Cursor, ...values: InsertNode[]): void {
    const operations = values.map((value, i) => {
      const operation = this.getInsertOperation({ ...start, column: start.column + i }, value);
      this.addNode(operation);
      return operation;
    });
    // break data into data chunks - less network traffic
    chunkData(operations, CHUNK_DATA_SIZE).forEach(chunk => {
      socket.emit('operation', chunk);
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
   * Gets the insert operation based on the given cursor and insert node.
   * @param start - the index where the new node should be inserted
   * @param value - the value of the new node
   * @param styles
   * @private
   * @returns the insert operation
   */
  private getInsertOperation({ line, column }: Cursor, { value, styles }: InsertNode): InsertOperation {
    const id = { sender: this.replicaId, counter: this.counter++ };
    const lineNode = line === 0 ? this.tree.root : this.findNode('\n', line);
    const leftOrigin = column === 0 ? lineNode : this.tree.getByIndex(lineNode, line === 0 ? column - 1 : column);
    if (isEmpty(leftOrigin.rightChildren)) {
      return { type: 'insert', id, value, parent: leftOrigin.id, side: 'R', styles };
    }
    const rightOrigin = this.tree.getLeftmostDescendant(leftOrigin.rightChildren[0]);
    return { type: 'insert', id, value, parent: rightOrigin.id, side: 'L', styles };
  }

  /**
   * Inserts a new node in the tree based on the given operation.
   * @param id
   * @param value
   * @param parent
   * @param side
   * @param styles
   */
  private addNode({ id, value, parent, side, styles }: InsertOperation) {
    this.tree.addNode(id, value, parent, side, styles);
  }

  /**
   * Deletes the nodes from the given start index to the given end index.
   * @param selection
   */
  deleteLocal(selection: Selection): void {
    const operations: DeleteOperation[] = Array.from(this.traverseBySelection(selection)).map(node => {
      const { id } = node;
      this.removeNode(id);
      return { type: 'delete', id };
    });
    // break data into data chunks - less network traffic
    chunkData(operations, CHUNK_DATA_SIZE).forEach(chunk => {
      socket.emit('operation', chunk);
    });
  }

  /**
   * Deletes the node based on the given operation.
   * @param operation
   */
  deleteRemote(operation: DeleteOperation): void {
    this.removeNode(operation.id);
  }

  /**
   * Deletes the node based on the given node id
   * @param id
   */
  private removeNode(id: Id): void {
    this.tree.deleteNode(id);
  }

  updateStyleLocal(selection: Selection, value: boolean, format: string) {
    const operations: StyleOperation[] = Array.from(this.traverseBySelection(selection)).map(node => {
      const { id } = node;
      const style = format as Style;
      this.tree.updateStyle(id, style, value);
      return {
        type: 'style',
        id,
        style: style,
        value: value,
      };
    });
    // break data into data chunks - less network traffic
    chunkData(operations, CHUNK_DATA_SIZE).forEach(chunk => {
      socket.emit('operation', chunk);
    });
  }

  updateStyleRemote({ id, style, value }: StyleOperation): void {
    this.tree.updateStyle(id, style, value);
  }

  /**
   * Makes a full traversal of the tree.
   */
  traverseTree = () => this.tree.traverse(this.tree.root);

  private *traverseBySelection(selection: Selection): IterableIterator<Node<string>> {
    const { start, end } = selection;
    let lineCounter = 0;
    let columnCounter = 0;
    let inBounds = false;
    for (const node of this.traverseTree()) {
      // start condition
      if (
        lineCounter === start.line &&
        (columnCounter === start.column || (isEqual(start, end) && columnCounter === start.column - 1))
      ) {
        inBounds = true;
      }
      // end condition
      if (lineCounter === end.line && columnCounter === end.column) {
        break;
      }
      // yield node if in bounds
      if (inBounds && node.value !== '\n') {
        yield node;
      }
      // update counters
      if (node.value === '\n') {
        lineCounter++;
        columnCounter = 0;
      } else {
        columnCounter++;
      }
    }
  }

  getNodeByCursor(cursor: Cursor): Node<string> {
    const iterator = this.traverseBySelection({ start: cursor, end: cursor });
    return iterator.next().value;
  }

  private findNode(value: string, skip: number): Node<string> {
    let lastMatch = this.tree.root;
    for (const node of this.traverseTree()) {
      if (node.value === value) {
        lastMatch = node;
        if (--skip === 0) return lastMatch;
      }
    }
    return lastMatch;
  }

  /**
   * Returns the string representation of the tree.
   * @returns the string representation of the tree.
   */
  toString(): string {
    return this.tree.toString();
  }

  getRootNode(): Node<string> {
    return this.tree.root!;
  }
}
