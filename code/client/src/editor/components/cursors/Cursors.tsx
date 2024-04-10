import { useState } from 'react';
import useSocketListeners from '@socket/useSocketListeners';
import { CursorData } from '@editor/components/cursors/CursorData';
import Cursor from '@editor/components/cursors/Cursor';
import './Cursors.scss';
import { Socket } from 'socket.io-client';

type CursorProps = {
  socket : Socket
}

function Cursors({socket} : CursorProps) {
  const [cursors, setCursors] = useState<CursorData[]>([]);

  const onCursorChange = (cursor: CursorData) => {
    setCursors(prevCursors => {
      const otherCursors = prevCursors.filter(c => c.id !== cursor.id);
      return [...otherCursors, cursor];
    });
  };

  useSocketListeners(socket, {
    cursorChange: onCursorChange,
  });

  return cursors.map(cursor => <Cursor key={cursor.id} id={cursor.id} color={cursor.color} range={cursor.range} />);
}

export default Cursors;
