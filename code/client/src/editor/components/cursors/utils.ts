import { Range } from 'slate';
import { ReactEditor } from 'slate-react';

type getPositionByRangeReturnType = {
  top: number;
  left: number;
  size?: { width: number; height: number };
};

/**
 * Get the position of a range in the editor
 * @param editor
 * @param range
 */
export function toDomRange(editor: ReactEditor, range: Range): getPositionByRangeReturnType {
  const domRange = ReactEditor.toDOMRange(editor, range);
  const { top, left, width, height } = domRange.getBoundingClientRect();
  const size = width > 0.1 ? { width, height } : undefined;
  return { top, left, size };
}
