import { useEffect, useRef } from 'react';
import { toDomRange } from '@editor/slate/utils/selection';
import { useSlate } from 'slate-react';
import { CursorData } from '@editor/components/cursors/CursorData';

/**
 * Renders a cursor at the given range
 * @param id
 * @param range
 * @param color
 * @constructor
 */
function Cursor({ id, range, color }: CursorData) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const editor = useSlate();

  useEffect(() => {
    if (!cursorRef.current) return;
    cursorRef.current?.classList.remove('animate');
    const { top, left, size } = toDomRange(editor, range);

    cursorRef.current.style.top = `${top - 1}px`;
    cursorRef.current.style.left = `${left - 1}px`;
    cursorRef.current.style.width = size ? `${size.width}px` : '2px';
    cursorRef.current.style.height = size ? `${size.height}px` : '1.5em';

    if (!size) {
      setTimeout(() => {
        cursorRef.current?.classList.add('animate');
      }, 500);
    }
  }, [editor, range]);

  return <div id={`cursor-${id}`} ref={cursorRef} className="cursor" style={{ backgroundColor: color }} />;
}

export default Cursor;
