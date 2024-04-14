import { Editor, Node, Path, Point, Range } from 'slate';
import { Cursor, emptyCursor, emptySelection, Selection } from '@notespace/shared/types/cursor';
import { first, isEqual } from 'lodash';
import { ReactEditor } from 'slate-react';

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
const pointsToSelection = (editor: Editor, start: Point, end: Point): Selection => ({
  start: pointToCursor(editor, start),
  end: pointToCursor(editor, end),
});

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

/**
 * Get the position of a range in the editor
 * @param editor
 * @param range
 */
export function toDomRange(editor: ReactEditor, range: Range | null) {
  if (!range) return { top: 0, left: 0, size: undefined };
  const domRange = ReactEditor.toDOMRange(editor, range);
  const { top, left, width, height } = domRange.getBoundingClientRect();
  const isSelection = range.anchor.offset !== range.focus.offset;
  const size = isSelection ? { width, height } : undefined;
  return { top, left, size };
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
