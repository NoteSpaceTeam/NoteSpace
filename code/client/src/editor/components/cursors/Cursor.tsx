import { Selection } from '@notespace/shared/types/cursor';
import { useEffect, useRef } from 'react';

type CursorProps = {
  id: string;
  selection: Selection;
  color: string;
};

function Cursor({ id, selection, color }: CursorProps) {
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
      const charWidth = 8.8;
      let top = start.line * lineHeight + editorRect.top;
      let left = start.column * charWidth + editorRect.left;
      if (left + charWidth > editorRect.right) {
        // overflow to the next line
        left -= editorRect.width - 2;
        top += fontSize * 1.5;
      }
      cursorRef.current.style.top = top + 'px';
      cursorRef.current.style.left = left + 'px';
    }
  }, [selection]);

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
