import { useState } from 'react';
import useSocketListeners from '@socket/useSocketListeners';
import { CursorData } from '@editor/components/cursors/CursorData';
import Cursor from '@editor/components/cursors/Cursor';
import './Cursors.scss';

function Cursors() {
  const [cursors, setCursors] = useState<CursorData[]>([]);

  const onCursorChange = (cursor: CursorData) => {
    const cursorElement = document.getElementById(`cursor-${cursor.id}`);
    cursorElement?.classList.remove('animate');
    setTimeout(() => {
      cursorElement?.classList.add('animate');
    }, 500);
    setCursors(prevCursors => {
      const otherCursors = prevCursors.filter(c => c.id !== cursor.id);
      return [...otherCursors, cursor];
    });
  };

  useSocketListeners({
    cursorChange: onCursorChange,
  });

  return cursors.map(cursor => (
    <Cursor key={cursor.id} id={cursor.id} color={cursor.color} selection={cursor.selection} />
  ));
}

export default Cursors;
