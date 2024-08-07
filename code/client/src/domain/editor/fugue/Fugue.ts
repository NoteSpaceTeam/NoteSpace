import { BlockStyle, InlineStyle } from '@notespace/shared/src/document/types/styles';
import { FugueTree } from '@domain/editor/fugue/FugueTree';
import { generateReplicaId, nodeInsert } from './utils';
import { type FugueNode, type NodeInsert } from '@domain/editor/fugue/types';
import { Cursor, Selection } from '@domain/editor/cursor';
import { isEmpty, last, range } from 'lodash';
import { Id } from '@notespace/shared/src/document/types/types';
import {
  BlockStyleOperation,
  DeleteOperation,
  InlineStyleOperation,
  InsertOperation,
  Operation,
} from '@notespace/shared/src/document/types/operations';

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
  private getInsertOperation(cursor: Cursor, { value, styles }: NodeInsert): InsertOperation {
    const id = { sender: this.replicaId, counter: this.counter++ };
    const leftOrigin = this.getNodeByCursor(cursor)!;
    const parent = (
      isEmpty(leftOrigin.rightChildren) ? leftOrigin : this.tree.getLeftmostDescendant(leftOrigin.rightChildren[0])
    ).id;
    return {
      type: 'insert',
      id,
      value,
      parent,
      side: isEmpty(leftOrigin.rightChildren) ? 'R' : 'L',
      styles,
      line: cursor.line,
    };
  }

  /**
   * Inserts a new node in the tree based on the given operation.
   * @param operation
   */
  private addNode = ({ id, value, line, styles, parent, side }: InsertOperation) => {
    this.tree.addNode(id, value, parent, side, line, styles);
  };

  /**
   * Deletes the nodes from the given start index to the given end index.
   * @param selection
   */
  deleteLocal(selection: Selection): DeleteOperation[] {
    const nodes = Array.from(this.traverseBySelection(selection));
    const cursor = { ...selection.start };
    return nodes.map(node => {
      if (node.value === '\n') {
        cursor.line++;
        cursor.column = 0;
      } else {
        cursor.column++;
      }
      return this.removeNode(node.id);
    });
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
  deleteLocalById = (...ids: Id[]): DeleteOperation[] => {
    return ids.map(id => this.removeNode(id));
  };

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
      return { type: 'inline-style', id, style, value };
    });
    return operations;
  }

  /**
   * Updates the style of the node based on the given operation
   * @param id
   * @param style
   * @param value
   */
  updateInlineStyleRemote = ({ id, style, value }: InlineStyleOperation) =>
    this.tree.updateInlineStyle(id, style, value);

  /**
   * Updates the style of the node based on the given operation
   * @param line - the line number
   * @param style - the style to be updated
   * @param append - if true, appends the style to the existing styles, otherwise replaces them
   */
  updateBlockStyleLocal(line: number, style: BlockStyle, append: boolean = false): BlockStyleOperation {
    this.tree.updateBlockStyle(style, line, append);
    return { type: 'block-style', line, style, append };
  }

  /**
   * Updates the style of the nodes by the given selection
   * @param style
   * @param selection
   */
  updateBlockStylesLocalBySelection = (style: BlockStyle, selection: Selection) =>
    range(selection.start.line, selection.end.line + 1).map(line => this.updateBlockStyleLocal(line, style));

  /**
   * Updates the style of the node based on the given operation
   * @param line
   * @param style
   * @param append
   */
  updateBlockStyleRemote = ({ line, style, append }: BlockStyleOperation) =>
    this.tree.updateBlockStyle(style, line, append);

  getBlockStyle = (line: number): BlockStyle => (this.tree.root.styles[line] as BlockStyle) || 'paragraph';

  /**
   * Traverses the tree in in-order traversal
   * @returns iterator of nodes
   */
  traverseTree = (returnDeleted: boolean = false) => this.tree.traverse(this.tree.root, returnDeleted);

  /**
   * Traverses the tree by the given selection
   * @param selection - the selection from which to traverse, in format ]start, end]
   * @param returnDeleted
   */
  *traverseBySelection(selection: Selection, returnDeleted: boolean = false): IterableIterator<FugueNode> {
    const { start, end } = selection;
    let lineCounter = 0, // start.line
      columnCounter = 0,
      inBounds = false;

    for (const node of this.tree.traverse(this.tree.root, returnDeleted)) {
      // start condition
      if (lineCounter === start.line && columnCounter === start.column) inBounds = true;

      // yield node if in bounds
      if (inBounds) yield node;

      // update counters
      if (node.value === '\n') {
        lineCounter++;
        columnCounter = 0;
      } else {
        columnCounter++;
      }
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
    if (column === 0) return this.getLineRoot(line);
    const start = { line, column: column - 1 };
    const end = { line, column };
    const iterator = this.traverseBySelection({ start, end });
    return iterator.next().value;
  }

  getLineRoot = (line: number): FugueNode => {
    return line === 0 ? this.tree.root : this.tree.root.value[line - 1];
  };

  /**
   * Returns the string representation of the tree.
   */
  toString = (): string => this.tree.toString();

  /**
   * Returns a node by id
   */
  getNodeById = (id: Id): FugueNode => this.tree.getById(id);
}
