import { BaseRange, Editor, NodeEntry, Transforms } from 'slate';
import { Range, Text } from 'slate';
import { useCallback, useState } from 'react';
import useSocketListeners from '@socket/useSocketListeners';

export type CursorData = {
  id: string;
  range: Range | null;
  color: string;
};


// Separate the logic into functions

export function useCursors(editor: Editor) {
  const [cursors, setCursors] = useState<CursorData[]>([]);

  const onCursorChange = (cursor: CursorData) => {
    setCursors(prevCursors => {
      const otherCursors = prevCursors.filter(c => c.id !== cursor.id);
      if (!cursor.range) return otherCursors;
      return [...otherCursors, cursor];
    });
    if (!cursor.range) {
      Transforms.unsetNodes(editor, 'cursor', { match: n => n.cursor.id === cursor.id });
      return;
    }
    Transforms.setNodes(editor, { cursor }, { at: cursor.range, match: n => Text.isText(n) && !n.cursor!.id });
  };

  useSocketListeners({
    cursorChange: onCursorChange,
  });

  const decorate = useCallback(
    ([node, path]: NodeEntry) => {
      if (!Text.isText(node)) return [];

      const ranges: Range[] = [];
      for (const cursor of cursors) {
        if (!cursor.range) continue;
        const editorPath = Editor.path(editor, path);
        const [start, end] = Range.edges(cursor.range);
        if (Range.includes(cursor.range, editorPath)) {
          ranges.push({
            anchor: start,
            focus: end,
            cursor,
          } as BaseRange & { cursor: CursorData });
        }
      }
      return ranges;
    },
    [cursors, editor]
  );

  return { decorate };
}

export default useCursors;
