import { Editor, Range, Point, Path, Text, Node } from 'slate';
import { Cursor, Selection } from '@notespace/shared/types/cursor';

export function isSelected(editor: Editor) {
  if (!editor.selection) return false;
  const { anchor, focus } = editor.selection;
  return anchor.path !== focus.path && anchor.offset !== focus.offset;
}

/**
 * Returns the current default slate selection
 * @param editor
 */
export function getSelection(editor: Editor): Selection {
  const { selection } = editor;
  if (!selection) {
    return emptySelection();
  }
  const start = selection.anchor;
  const end = selection.focus;
  return {
    start: {
      line: start.path[0],
      column: start.offset,
    },
    end: {
      line: end.path[0],
      column: end.offset,
    },
  };
}

/**
 * Returns the current selection as an absolute selection, regardless of tree structure
 * @param editor
 */
export function getAbsoluteSelection(editor: Editor): Selection {
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
    column: getLineOffset(editor, point),
  };
}

function getLineOffset(editor: Editor, point: Point): number {
  let offset = 0;
  // get the children of the line where the selection is
  const lineChildren = Node.children(editor, [point.path[0]]);

  for (const entry of lineChildren) {
    const [node, nodePath] = entry;
    // if the node is a text node
    if (Text.isText(node)) {
      // if the path of the current node is less than the path of the selection
      if (Path.compare(nodePath, point.path) < 0) {
        // add its text length to the offset
        offset += node.text.length;
      }
      // if the path of the current node is equal to the path of the selection
      else if (Path.compare(nodePath, point.path) === 0) {
        // add the offset within the node to the column
        offset += editor.selection?.anchor.offset || 0;
        break;
      }
    }
  }
  return offset;
}

function emptySelection(): Selection {
  return {
    start: { line: 0, column: 0 },
    end: { line: 0, column: 0 },
  };
}

export function getSelectionByRange(range: Range, offset: number = 0): Selection {
  return {
    start: {
      line: range.anchor.path[0],
      column: range.anchor.offset + offset,
    },
    end: {
      line: range.focus.path[0],
      column: range.focus.offset + offset,
    },
  };
}
