import { BaseRange, Editor, NodeEntry, Path } from 'slate';
import { Range, Text } from 'slate';
import { useState } from 'react';
import useSocketListeners from '@socket/useSocketListeners';
import { Communication } from '@editor/domain/communication';

export type CursorData = {
  id: string;
  range: Range | null;
  color: string;
};

export function useCursors(editor: Editor, communication: Communication) {
  const [cursors, setCursors] = useState<CursorData[]>([]);

  const onCursorChange = (cursor: CursorData) => {
    setCursors(prevCursors => {
      if (!cursor.range) return prevCursors;
      const otherCursors = prevCursors.filter(c => c.id !== cursor.id);
      return [...otherCursors, cursor];
    });
  };

  useSocketListeners(communication, {
    cursorChange: onCursorChange,
  });

  const decorate = ([node, path]: NodeEntry) => {
    if (!Text.isText(node)) return [];

    const ranges: Range[] = [];
    for (const cursor of cursors) {
      if (!cursor.range) continue;
      const editorPath = Editor.path(editor, path);
      const [start, end] = Range.edges(cursor.range);

      if (Range.includes(cursor.range, editorPath)) {
        const newStart = {
          path: start.path,
          offset: Path.equals(start.path, editorPath) ? start.offset : 0,
        };
        const newEnd = {
          path: end.path,
          offset: Path.equals(end.path, editorPath) ? end.offset : node.text.length,
        };
        ranges.push({
          anchor: newStart,
          focus: newEnd,
          cursor,
        } as BaseRange & { cursor: CursorData });
      }
    }

    return ranges;
  };

  return { decorate };
}

export default useCursors;
