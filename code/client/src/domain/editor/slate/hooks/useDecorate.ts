import { CursorData } from '@/domain/editor/slate/hooks/useCursors';
import { BaseRange, Editor, NodeEntry, Path, Range, Text } from 'slate';

function useDecorate(editor: Editor, cursors: CursorData[]) {
  return ([node, path]: NodeEntry) => {
    if (!Text.isText(node)) return [];

    const ranges: Range[] = [];
    for (const cursor of cursors) {
      if (!cursor.range) continue;
      const editorPath = Editor.path(editor, path);
      const [start, end] = Range.edges(cursor.range);

      if (!Range.includes(cursor.range, editorPath)) continue;
      const newStart = {
        path: start.path,
        offset: Path.equals(start.path, editorPath) ? start.offset : 0,
      };
      const newEnd = {
        path: end.path,
        offset: Path.equals(end.path, editorPath) ? end.offset : node.text.length,
      };

      ranges.push({ anchor: newStart, focus: newEnd, cursor } as BaseRange & { cursor: CursorData });
    }
    return ranges;
  };
}

export default useDecorate;
