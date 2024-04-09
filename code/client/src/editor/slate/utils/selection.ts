import { Editor, Range, Point, Path, Node } from 'slate';
import { Cursor, Selection, emptySelection } from '@notespace/shared/types/cursor';
import { first } from 'lodash';

/**
 * Checks if the current selection is active
 * @param editor
 */
export function isSelected(editor: Editor) {
  if (!editor.selection) return false;
  const { anchor, focus } = editor.selection;
  return !Point.equals(anchor, focus);
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
function pointsToSelection(editor: Editor, start: Point, end: Point): Selection {
  return {
    start: pointToCursor(editor, start),
    end: pointToCursor(editor, end),
  };
}

/**
 * Converts a slate point to a cursor
 * @param editor
 * @param point
 */
function pointToCursor(editor: Editor, point: Point): Cursor {
  const line = point.path[0];
  const children = Node.children(editor, [line]);
  const cursor: Cursor = { line, column: point.offset };

  for (const entry of children) {
    if (Path.equals(entry[1], point.path)) break;
    cursor.column += first(entry).text.length;
  }
  return cursor;
}

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

export function getSelectionBySlate(path: Path, offset: number): Selection {
  return { start: { line: path[0], column: offset }, end: { line: path[0], column: offset } };
}
