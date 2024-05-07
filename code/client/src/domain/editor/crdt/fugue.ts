import { type Id } from '@notespace/shared/crdt/types/nodes';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { FugueTree } from '@notespace/shared/crdt/FugueTree';
import { generateReplicaId, nodeInsert } from './utils';
import { type FugueNode, type NodeInsert } from '@domain/editor/crdt/types';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { isEmpty, last, range } from 'lodash';
import {
  BlockStyleOperation,
  DeleteOperation,
  InlineStyleOperation,
  InsertOperation,
  Operation,
  ReviveOperation,
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

  applyOperations(operations: Operation[], override: boolean = false) {
    if (override) this.tree.clear();
    for (const operation of operations) {
      switch (operation.type) {
        case 'insert':
          this.insertRemote(operation);
          break;
        case 'delete':
          this.deleteRemote(operation);
          break;
        case 'inline-style':
          this.updateInlineStyleRemote(operation);
          break;
        case 'block-style':
          this.updateBlockStyleRemote(operation);
          break;
        case 'revive':
          this.reviveRemote(operation);
          break;
        default:
          throw new Error('Invalid operation type');
      }
    }
  }

  /**
   * Inserts the given values starting from the given index.
   * @param cursor
   * @param values
   */
  insertLocal({ line, column }: Cursor, ...values: (NodeInsert | string)[]): InsertOperation[] {
    return values.map(value => {
      const node = typeof value === 'string' ? nodeInsert(value, []) : value;
      const operation = this.getInsertOperation({ line, column }, node);

      this.addNode(operation);

      if (node.value === '\n') line++;
      column = node.value === '\n' ? 0 : column + 1;

      return operation;
    });
  }

  /**
   * Inserts a new node in the tree based on the given operation.
   * @param operation
   */
  insertRemote = (operation: InsertOperation) => this.addNode(operation);

  /**
   * Returns the insert operation based on the given cursor and insert node
   * @param cursor
   * @param insertNode
   */
  private getInsertOperation({ line, column }: Cursor, { value, styles }: NodeInsert) {
    const id = { sender: this.replicaId, counter: this.counter++ };
    let operation: InsertOperation;

    const leftOrigin = this.getNodeByCursor({ line, column })!;

    if (isEmpty(leftOrigin.rightChildren))
      operation = { type: 'insert', id, value, parent: leftOrigin.id, side: 'R', styles };
    else {
      const rightOrigin = this.tree.getLeftmostDescendant(leftOrigin.rightChildren[0]);
      operation = { type: 'insert', id, value, parent: rightOrigin.id, side: 'L', styles };
    }
    if (value === '\n') operation.line = line;
    return operation;
  }

  /**
   * Inserts a new node in the tree based on the given operation.
   * @param line
   * @param id
   * @param value
   * @param parent
   * @param side
   * @param styles
   */
  private addNode = ({ line, id, value, parent, side, styles }: InsertOperation) => {
    if (value === '\n') this.tree.addLineRoot(line || 0, id, parent, side, styles);
    else this.tree.addNode(id, value, parent, side, styles || []);
  };

  /**
   * Deletes the nodes from the given start index to the given end index.
   * @param selection
   */
  deleteLocal(selection: Selection): DeleteOperation[] {
    const nodes = Array.from(this.traverseBySelection(selection));
    return nodes.map(node => this.removeNode(node.id));
  }

  /**
   * Deletes the node at the given cursor
   * @param cursor
   */
  deleteLocalByCursor(cursor: Cursor) {
    const node = this.getNodeByCursor(cursor);
    if (node) return this.deleteLocalById(node.id);
  }

  /**
   * Deletes the node based on the given operation
   * @param ids
   */
  deleteLocalById = (...ids: Id[]): DeleteOperation[] => ids.map(id => this.removeNode(id));

  /**
   * Deletes the node based on the given operation
   * @param operation
   */
  deleteRemote = (operation: DeleteOperation) => this.tree.deleteNode(operation.id);

  /**
   * Deletes the node based on the given node id
   * @param id
   */
  private removeNode(id: Id): DeleteOperation {
    this.tree.deleteNode(id);
    return { type: 'delete', id };
  }

  /**
   * Relives the nodes from the given start index and given length.
   * @param selection
   */
  reviveLocal(selection: Selection): ReviveOperation[] {
    const nodes = Array.from(this.traverseBySelection(selection, true));
    return nodes.map(node => this.reviveNode(node.id));
  }

  /**
   * Revives the node at the given cursor
   * @param cursor
   */
  reviveLocalByCursor(cursor: Cursor) {
    const node = this.getNodeByCursor(cursor);
    if (node) return this.reviveNode(node.id);
  }

  /**
   * Revives a node based on the given id
   * @param id
   */
  reviveNode(id: Id): ReviveOperation {
    this.tree.reviveNode(id);
    return { type: 'revive', id };
  }

  /**
   * Revives a node based on the given operation
   * @param operation
   */
  reviveRemote(operation: ReviveOperation): void {
    this.tree.reviveNode(operation.id);
  }

  /**
   * Updates the style of the nodes by the given selection
   * @param selection
   * @param value
   * @param format
   */
  updateInlineStyleLocal(selection: Selection, format: InlineStyle, value: boolean = true) {
    const nodes = Array.from(this.traverseBySelection(selection));
    const operations: InlineStyleOperation[] = nodes.map(node => {
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

  /**
   * Updates the style of the node based on the given operation
   * @param line - the line number
   * @param style - the style to be updated
   * @param append - if true, appends the style to the existing styles, otherwise replaces them
   */
  updateBlockStyleLocal(line: number, style: BlockStyle, append: boolean = false): BlockStyleOperation {
    this.tree.updateBlockStyle(style, line, append);
    return {
      type: 'block-style',
      line,
      style,
      append,
    };
  }

  /**
   * Updates the style of the nodes by the given selection
   * @param style
   * @param selection
   */
  updateBlockStylesLocalBySelection(style: BlockStyle, selection: Selection) {
    return range(selection.start.line, selection.end.line + 1).map(line => this.updateBlockStyleLocal(line, style));
  }

  /**
   * Updates the style of the node based on the given operation
   * @param line
   * @param style
   * @param append
   */
  updateBlockStyleRemote({ line, style, append }: BlockStyleOperation) {
    this.tree.updateBlockStyle(style, line, append);
  }

  getBlockStyle(line: number): BlockStyle {
    return (this.tree.root.styles[line] as BlockStyle) || 'paragraph';
  }

  /**
   * Traverses the tree in in-order traversal
   * @returns iterator of nodes
   */
  traverseTree = (returnDeleted: boolean = false) => this.tree.traverse(this.tree.root, returnDeleted);

  /**
   * Traverses the tree by the given selection
   * @param selection
   * @param returnDeleted
   */
  *traverseBySelection(selection: Selection, returnDeleted: boolean = false): IterableIterator<FugueNode> {
    const { start, end } = selection;
    let lineCounter = start.line,
      columnCounter = 0,
      inBounds = false;

    const lineRootNode = this.tree.getLineRoot(start.line);

    for (const node of this.tree.traverse(lineRootNode, returnDeleted)) {
      // start condition
      if (lineCounter === start.line && columnCounter === start.column) inBounds = true;

      // yield node if in bounds
      if (inBounds) yield node;

      // update counters
      if (node.value === '\n') lineCounter++;

      columnCounter = node.value === '\n' ? 0 : columnCounter + 1;
      // end condition
      if (lineCounter === end.line && columnCounter === end.column) break;
    }
  }

  /**
   * Traverses the tree until the given separator is found by cursor position
   * @param separator
   * @param line
   * @param column
   * @param reverse
   * @param inclusive
   */
  *traverseBySeparator(
    separator: string,
    { line, column }: Cursor,
    reverse: boolean = false,
    inclusive: boolean = false
  ): IterableIterator<FugueNode[]> {
    const selection = reverse
      ? { start: { line, column: 0 }, end: { line, column } }
      : { start: { line, column }, end: { line, column: Infinity } };

    const nodesInSelection = Array.from(this.traverseBySelection(selection));
    const elements = reverse ? nodesInSelection.reverse() : nodesInSelection;

    const nodes: FugueNode[] = [];

    for (const node of elements) {
      if (node.value === separator && last(nodes)?.value !== separator) {
        if (inclusive) nodes.push(node);
        break;
      }
      nodes.push(node);
    }
    yield nodes;
  }

  /**
   * Deletes the next word by the given cursor
   * @param cursor
   * @param reverse - if true, deletes the word to the left of the cursor
   */
  deleteWordByCursor(cursor: Cursor, reverse: boolean = false) {
    const iterator = this.traverseBySeparator(' ', cursor, reverse);
    const nodes: FugueNode[] = iterator.next().value;
    if (!nodes) return;
    return this.deleteLocalById(...nodes.map(node => node.id));
  }

  /**
   * Returns the node at the given cursor
   * @param cursor
   */
  getNodeByCursor({ line, column }: Cursor): FugueNode | undefined {
    if (column === 0) return this.tree.getLineRoot(line);

    const start = { line, column: column - 1 };
    const end = { line, column: column };
    const iterator = this.traverseBySelection({ start, end });
    return iterator.next().value;
  }

  /**
   * Returns the string representation of the tree.
   */
  toString = (): string => this.tree.toString();

  /**
   * Returns a node by id
   */
  getNodeById = (id: Id): FugueNode => this.tree.getById(id);
}
