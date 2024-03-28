import { Editor, Range, Point, Text, Node, Path } from 'slate';
import { Cursor, Selection } from '../model/cursor.ts';

function emptySelection(): Selection {
  return {
    start: { line: 0, column: 0 },
    end: { line: 0, column: 0 },
  };
}

export function isSelected(editor: Editor) {
  if (!editor.selection) return false;
  const { anchor, focus } = editor.selection;
  return anchor.path !== focus.path && anchor.offset !== focus.offset;
}

export function getSelection(editor: Editor): Selection {
  const { selection } = editor;
  if (!selection) {
    return emptySelection();
  }
  const [start, end] = Range.edges(selection);
  return {
    start: pointToCursor(editor, start),
    end: pointToCursor(editor, end),
  };
}

function pointToCursor(editor: Editor, point: Point): Cursor {
  return {
    line: point.path[0],
    column: getAbsoluteOffset(editor, point),
  };
}

function getAbsoluteOffset(editor: Editor, point: Point): number {
  let offset = 0;
  let line = 0;

  // Traverse the nodes in the document
  for (const [node, path] of Node.nodes(editor)) {
    if (Text.isText(node)) {
      if (Path.isBefore(path, point.path)) {
        // If the current text node is before the point, add its length to the offset
        offset += node.text.length;
        // If the text node contains a line break, increment the line count and reset the offset
        if (node.text.includes('\n')) {
          line++;
          offset = 0;
        }
      } else if (Path.equals(path, point.path)) {
        // If the current text node contains the point, add the point's offset to the total offset
        offset += point.offset;
        break;
      }
    }
    if (line !== point.path[0]) {
      offset = 0;
    }
  }

  return offset;
}
