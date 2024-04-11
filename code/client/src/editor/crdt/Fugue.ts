import { type Id, Nodes } from '@notespace/shared/crdt/types/nodes';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import { generateReplicaId } from './utils';
import { type FugueNode, type NodeInsert } from '@editor/crdt/types';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { isEmpty, isEqual, range } from 'lodash';
import {
  BlockStyleOperation,
  DeleteOperation,
  InlineStyleOperation,
  InsertOperation,
} from '@notespace/shared/crdt/types/operations';

/**
 * Class that represents a local replica of a FugueTree
 * @param T - the type of the values stored in the tree
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
   * @param nodes
   */
  setTree(nodes: Nodes<string>): void {
    this.tree.setTree(nodes);
  }

  /**
   * Inserts the given values starting from the given index.
   * @param start
   * @param values
   */
  insertLocal(start: Cursor, ...values: NodeInsert[] | string[]) {
    return values.map((value, i) => {
      const node = typeof value === 'string' ? { value, styles: [] } : value;
      const operation = this.getInsertOperation({ ...start, column: start.column + i }, node);
      this.addNode(operation);
      return operation;
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
  private getInsertOperation({ line, column }: Cursor, { value, styles }: NodeInsert): InsertOperation {
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
  deleteLocal(selection: Selection) {
    const operations: DeleteOperation[] = Array.from(this.traverseBySelection(selection)).map(node => {
      const { id } = node;
      this.removeNode(id);
      return { type: 'delete', id };
    });
    return operations;
  }

  /**
   * Deletes the node based on the given operation
   * @param ids
   */
  deleteLocalById = (...ids: Id[]): DeleteOperation[] =>
    ids.map(id => {
      this.removeNode(id);
      return { type: 'delete', id };
    });

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
    return operations;
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
    return operation;
  }

  updateBlockStylesLocalBySelection(type: BlockStyle, selection: Selection) {
    return range(selection.start.line, selection.end.line + 1, 1).map(line => this.updateBlockStyleLocal(type, line));
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
  *traverseBySelection(selection: Selection): IterableIterator<FugueNode> {
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
  ): IterableIterator<FugueNode[]> {
    const nodes: FugueNode[] = [];
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
    if (isEmpty(nodes)) yield nodes;
  }

  /**
   * Deletes the word at the given cursor
   * @param line
   * @param column
   * @param reverse - if true, deletes the word to the left of the cursor
   */
  deleteWordLocal({ line, column }: Cursor, reverse: boolean) {
    const iterator = this.traverseBySeparator(' ', { line, column }, reverse);
    const nodes: FugueNode[] = iterator.next().value;
    if (!nodes) return;
    return this.deleteLocalById(...nodes.map(node => node.id));
  }

  /**
   * Returns the node at the given cursor
   * @param cursor
   */
  getNodeByCursor(cursor: Cursor): FugueNode {
    const iterator = this.traverseBySelection({ start: cursor, end: cursor });
    return iterator.next().value;
  }

  /**
   * Finds the node skip-th node with the given value
   * @param value
   * @param skip
   */
  private findNode(value: string, skip: number): FugueNode {
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
  getRootNode(): FugueNode {
    return this.tree.root!;
  }
}
