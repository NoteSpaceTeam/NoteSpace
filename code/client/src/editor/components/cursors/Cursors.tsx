import { useState } from 'react';
import './CursorsManager.scss';
import useSocketListeners from '../../../socket/useSocketListeners.ts';

interface Cursor {
  id: string;
  position: { line: number; column: number };
  color: string;
}

function Cursors() {
  const [cursors, setCursors] = useState<Cursor[]>([]);

  const handleCursorChange = (cursor: Cursor) => {
    setCursors(prevCursors => {
      const updatedCursors = prevCursors.filter(c => c.id !== cursor.id);
      return [...updatedCursors, cursor];
    });
  };

  useSocketListeners({
    cursorChange: handleCursorChange,
  });

  const getCharacterWidth = (textarea: HTMLElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const computedStyle = getComputedStyle(textarea);
    ctx.font = computedStyle.font;
    return ctx.measureText('W').width;
  };

  const renderCursors = () => {
    return cursors.map(cursor => {
      const textarea = document.querySelector('textarea')!;
      const fontSize = parseFloat(getComputedStyle(textarea).fontSize);
      const lineHeight = fontSize * 1.2;
      const characterWidth = getCharacterWidth(textarea);
      const top = textarea.offsetTop + (cursor.position.line - 1) * lineHeight - 2;
      const left = textarea.offsetLeft + (cursor.position.column - 1) * characterWidth + 1;
      return (
        <div
          className="cursor"
          key={cursor.id}
          style={{
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            width: '2px',
            height: '1.5em',
            backgroundColor: cursor.color,
          }}
        />
      );
    });
  };
  return <>{renderCursors()}</>;
}

export default Cursors;
