import { Editor, Node, Path, Point, Range, Text } from 'slate';
import { Cursor, emptyCursor, emptySelection, Selection } from '@domain/editor/cursor';
import { first, isEqual } from 'lodash';

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
 * @param absolute
 */
export function pointToCursor(editor: Editor, point: Point, absolute : boolean = false): Cursor {
  const line = point.path[0];
  const cursor: Cursor = { line, column: point.offset };

  if (point.path[1] === 0) {
    cursor.column = (absolute ? cursor.column : cursor.column + 1);
    return cursor;
  }

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

  // Slate offset is off by one compared to the cursor column
  cursor.column = (absolute ? cursor.column : cursor.column + 1);
  return cursor;
}

export const cursorToPoint = (editor: Editor, cursor: Cursor): Point => {
  const { line, column } = cursor;
  const path = [];
  let offset = column;

  const nodes = Array.from(Node.children(editor, [line]));

  for (const [node, nodePath] of nodes) {
    if (!Text.isText(node)) continue;
    const text = node as Text;
    if (offset <= text.text.length) {
      path.push(...nodePath);
      break;
    }
    offset -= text.text.length;
  }

  return { path, offset };
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
