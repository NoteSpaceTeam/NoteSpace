import { Editor, Range, Point } from 'slate';
import { Cursor, Selection } from '../model/cursor.ts';

export function isSelected(editor: Editor) {
  if (!editor.selection) return false;
  const { anchor, focus } = editor.selection;
  return anchor.path !== focus.path && anchor.offset !== focus.offset;
}

// export function getSelection(editor: Editor): Selection {
//   if (!editor.selection) return { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } };
//   const { anchor, focus } = editor.selection;
//   const { path: startLine, offset: startColumn } = focus;
//   const { path: endLine, offset: endColumn } = anchor;
//   const start = { line: startLine[0], column: startColumn };
//   const end = { line: endLine[0], column: endColumn };
//   const isRightToLeft = start.line > end.line || (start.line === end.line && start.column > end.column);
//   return isRightToLeft ? { start: end, end: start } : { start, end };
// }

// does the same as the function above
export function getSelection(editor: Editor): Selection {
  const { selection } = editor;
  if (!selection) {
    return {
      start: { line: 0, column: 0 },
      end: { line: 0, column: 0 },
    };
  }
  const [start, end] = Range.edges(selection);
  return {
    start: pointToCursor(start),
    end: pointToCursor(end),
  };
}

function pointToCursor(point: Point): Cursor {
  return {
    line: point.path[0],
    column: point.offset,
  };
}
