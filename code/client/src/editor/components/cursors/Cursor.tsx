import { useEffect, useRef } from 'react';
import { getPositionByRange } from '@editor/components/cursors/utils';
import { useSlate } from 'slate-react';
import { Range } from 'slate';

type CursorProps = {
  id: string;
  range: Range;
  color: string;
};

function Cursor({ id, range, color }: CursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const editor = useSlate();

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current?.classList.remove('animate');
      const { top, left, size } = getPositionByRange(editor, range);
      cursorRef.current.style.top = `${top - 1}px`;
      cursorRef.current.style.left = `${left - 1}px`;
      if (size) {
        cursorRef.current.style.width = `${size.width}px`;
        cursorRef.current.style.height = `${size.height}px`;
      } else {
        cursorRef.current.style.width = '2px';
        cursorRef.current.style.height = '1.5em';
        setTimeout(() => {
          cursorRef.current?.classList.add('animate');
        }, 500);
      }
    }
  }, [editor, range]);

  return (
    <div
      id={`cursor-${id}`}
      ref={cursorRef}
      className="cursor"
      style={{
        position: 'absolute',
        width: '2px',
        height: '1.5em',
        backgroundColor: color,
      }}
    />
  );
}

export default Cursor;
