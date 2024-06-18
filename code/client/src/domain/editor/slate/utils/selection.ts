import { Editor, Node, Path, Point, Range, Text } from 'slate';
import { Cursor, emptyCursor, emptySelection, Selection } from '@domain/editor/cursor';
import { first, isEqual } from 'lodash';
import { CustomElement } from '@domain/editor/slate/types';

/**
 * Checks if the current selection is active
 * @param editor
 */
export function isSelected(editor: Editor) {
  if (!editor.selection) return false;
  return !Range.isCollapsed(editor.selection);
}

/**
 * Returns the current default slate selection
 * @param editor
 */
export function getSelection(editor: Editor): Selection {
  const { selection } = editor;
  if (!selection) return emptySelection();

  const [start, end] = Range.edges(selection);
  return pointsToSelection(editor, start, end);
}

/**
 * Converts slate points to a selection
 * @param editor
 * @param start
 * @param end
 */
const pointsToSelection = (editor: Editor, start: Point, end: Point): Selection => ({
  start: pointToCursor(editor, start),
  end: pointToCursor(editor, end),
});

/**
 * Converts a slate point to a cursor
 * @param editor
 * @param point
 */
export function pointToCursor(editor: Editor, point: Point): Cursor {
  const line = point.path[0];
  const cursor: Cursor = { line, column: point.offset };

  if (point.path[1] === 0) return cursor;

  const children = Array.from(Node.children(editor, [line]));

  for (const entry of children) {
    // If path has only one element, and it is the same as the first element of the point path - same line
    if (point.path.length === 1 && point.path[0] === entry[1][0]) break;

    // Else verify if the path is the same
    if (Path.equals(entry[1], point.path)) break;

    if (Text.isText(first(entry))) {
      const text = first(entry) as Text;
      cursor.column += text.text.length;
    }
  }

  return cursor;
}

export const cursorToPoint = (editor: Editor, cursor: Cursor): Point => {
  const { line, column } = cursor;
  let offset = column;

  // Get the path to the line node
  const linePath = [line];

  // Check if the path exists in the editor
  if (!Editor.hasPath(editor, linePath)) {
    throw new Error(`Cannot find a node at line ${line}`);
  }

  // Get the node at the line path
  const lineNode = Node.get(editor, linePath);

  // Check if the node is a valid block or container node
  if (!Editor.isBlock(editor, lineNode as CustomElement)) {
    throw new Error(`Node at line ${line} is not a block node`);
  }

  // Traverse the children of the line node to find the correct text node
  for (const [node, nodePath] of Node.children(editor, linePath)) {
    if (Text.isText(node)) {
      if (offset <= node.text.length) {
        return { path: nodePath, offset };
      }
      offset -= node.text.length;
    }
  }

  // If the offset is not found, return the end of the line node
  const lastTextNode = Node.last(editor, linePath);
  if (lastTextNode) {
    const [lastNode, lastPath] = lastTextNode;
    if (Text.isText(lastNode)) {
      return { path: lastPath, offset: lastNode.text.length };
    }
  }

  throw new Error('Cursor position is out of bounds');
};

/**
 * Returns the selection by range
 * @param editor
 * @param range
 * @param offset
 */
export function getSelectionByRange(editor: Editor, range: Range, offset: number = 0): Selection {
  const selection = pointsToSelection(editor, range.anchor, range.focus);
  selection.start.column += offset;
  selection.end.column += offset;
  return selection;
}

/**
 * Checks if the selection is empty
 * @param selection
 */
export function isSelectionEmpty(selection: Selection): boolean {
  const { start, end } = selection;
  const startCursor = emptyCursor();
  return isEqual(startCursor, start) && isEqual(start, end);
}
