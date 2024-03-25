import { Editor } from 'slate';
import { Selection } from '../model/cursor.ts';

export function isSelected(editor: Editor) {
  if (!editor.selection) return false;
  const { anchor, focus } = editor.selection;
  return anchor.offset !== focus.offset;
}

export function getSelection(editor: Editor): Selection {
  if (!editor.selection) return { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } };
  const { anchor, focus } = editor.selection;
  const { path: startLine, offset: startColumn } = focus;
  const { path: endLine, offset: endColumn } = anchor;
  const start = { line: startLine[0], column: startColumn };
  const end = { line: endLine[0], column: endColumn };
  const isRightToLeft = start.line > end.line || (start.line === end.line && start.column > end.column);
  return isRightToLeft ? { start: end, end: start } : { start, end };
}
