import {
  type DeleteOperation,
  type InsertOperation,
  type InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';
import { type Node, type Id } from '@notespace/shared/crdt/types/nodes';
import { BlockStyle, InlineStyle } from '../../../../shared/types/styles';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import { chunkData, generateReplicaId } from './utils';
import { socket } from '@src/socket/socket';
import { type InsertNode } from '@editor/crdt/types';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { isEmpty, isEqual } from 'lodash';

const CHUNK_DATA_SIZE = 50;

/**
 * Singleton that represents a local replica of a FugueTree
 * @param T - the type of the values stored in the tree
 */
export class Fugue {
  private static instance: Fugue;
  private readonly replicaId: string;
  private counter = 0;
  private readonly tree: FugueTree<string>;
  private title = '';

  private constructor() {
    this.replicaId = generateReplicaId();
    this.tree = new FugueTree();
  }

  static getInstance(): Fugue {
    if (!Fugue.instance) {
      Fugue.instance = new Fugue();
    }
    return Fugue.instance;
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
   * @param operation
   */
  insertRemote(operation: InsertOperation): void {
    this.addNode(operation);
  }

  /**
   * Returns the insert operation based on the given cursor and insert node
   * @param cursor
   * @param insertNode
   */
  private getInsertOperation({ line, column }: Cursor, { value, styles }: InsertNode): InsertOperation {
    const id = { sender: this.replicaId, counter: this.counter++ };
    const lineNode = line === 0 ? this.tree.root : this.findNode('\n', line);
    const leftOrigin = column === 0 ? lineNode : this.getNodeByCursor({ line, column });
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

  deleteLocalById(id: Id): void {
    this.removeNode(id);
    const operation: DeleteOperation = { type: 'delete', id };
    socket.emit('operation', [operation]);
  }

  /**
   * Deletes the node based on the given operation
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

  /**
   * Updates the style of the nodes by the given selection
   * @param selection
   * @param value
   * @param format
   */
  updateInlineStyleLocal(selection: Selection, value: boolean, format: InlineStyle) {
    const operations: InlineStyleOperation[] = Array.from(this.traverseBySelection(selection)).map(node => {
      const { id } = node;
      const style = format as InlineStyle;
      this.tree.updateInlineStyle(id, style, value);
      return {
        type: 'inline-style',
        id,
        style,
        value,
      };
    });
    // break data into data chunks - less network traffic
    chunkData(operations, CHUNK_DATA_SIZE).forEach(chunk => {
      socket.emit('operation', chunk);
    });
  }

  /**
   * Updates the style of the node based on the given operation
   * @param id
   * @param style
   * @param value
   */
  updateInlineStyleRemote({ id, style, value }: InlineStyleOperation): void {
    this.tree.updateInlineStyle(id, style, value);
  }

  updateBlockStyleLocal(type: BlockStyle, line: number) {
    this.tree.updateBlockStyle(type, line);
    const operation: BlockStyleOperation = {
      type: 'block-style',
      line,
      style: type,
    };
    socket.emit('operation', [operation]);
  }

  updateBlockStyleRemote({ line, style }: BlockStyleOperation) {
    this.tree.updateBlockStyle(style, line);
  }

  /**
   * Traverses the tree in in-order traversal
   * @returns iterator of nodes
   */
  traverseTree = () => this.tree.traverse(this.tree.root);

  /**
   * Traverses the tree by the given selection
   * @param selection
   */
  *traverseBySelection(selection: Selection): IterableIterator<Node<string>> {
    const { start, end } = selection;
    let lineCounter = 0,
      columnCounter = 0,
      inBounds = false;
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

  *traverseBySeparator(
    separator: string,
    { line, column }: Cursor,
    reverse: boolean = false
  ): IterableIterator<Node<string>[]> {
    const nodes: Node<string>[] = [];
    const selection = reverse
      ? { start: { line, column: 0 }, end: { line: line, column: column } }
      : { start: { line, column: column }, end: { line: line, column: Infinity } };

    const iterator = this.traverseBySelection(selection);
    const list = Array.from(iterator);
    const elements = reverse ? list.reverse() : list;

    for (const node of elements) {
      if (node.value === separator || node.value === '\n') {
        yield nodes;
        nodes.length = 0;
      }
      nodes.push(node);
    }
    if (nodes.length > 0) {
      yield nodes;
    }
  }

  /**
   * Deletes the word at the given cursor
   * @param line
   * @param column
   * @param reverse - if true, deletes the word to the left of the cursor
   */
  deleteWordLocal({ line, column }: Cursor, reverse: boolean) {
    const iterator = this.traverseBySeparator(' ', { line, column }, reverse);
    const operations: Node<string>[] = iterator.next().value;

    chunkData(
      operations.map(node => ({ type: 'delete', id: node.id })),
      CHUNK_DATA_SIZE
    ).forEach(chunk => {
      socket.emit('operation', chunk);
    });
  }

  /**
   * Returns the node at the given cursor
   * @param cursor
   */
  getNodeByCursor(cursor: Cursor): Node<string> {
    const iterator = this.traverseBySelection({ start: cursor, end: cursor });
    return iterator.next().value;
  }

  /**
   * Finds the node skip-th node with the given value
   * @param value
   * @param skip
   */
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
   */
  toString(): string {
    return this.tree.toString();
  }

  /**
   * Returns the root node of the tree
   */
  getRootNode(): Node<string> {
    return this.tree.root!;
  }

  /**
   * Returns the title of the document
   */
  getTitle(): string {
    return this.title;
  }

  /**
   * Sets the title of the document
   * @param title
   */
  setTitle(title: string): void {
    this.title = title;
  }
}
