import { Selection } from '@notespace/shared/types/cursor';
import { useEffect, useRef } from 'react';

type CursorProps = {
  selection: Selection;
  color: string;
};

function Cursor({ selection, color }: CursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cursorRef.current) {
      // TODO: fix cursor position and use selection.end to support selection ranges
      // calculate the absolute position of the cursor in pixels
      const start = selection.start;
      const editor = document.querySelector('.editable')!;
      const fontSize = parseFloat(getComputedStyle(editor).fontSize);
      const editorRect = editor.getBoundingClientRect();
      const lineHeight = fontSize * 2.5;
      const charWidth = 8;
      const top = start.line * lineHeight + editorRect.top + 'px';
      const left = start.column * charWidth + editorRect.left + 'px';
      cursorRef.current.style.top = top;
      cursorRef.current.style.left = left;
    }
  }, [selection]);

  return (
    <div
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
