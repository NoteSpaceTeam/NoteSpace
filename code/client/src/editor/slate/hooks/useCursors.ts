import { Range } from 'slate';
import { useState } from 'react';
import useSocketListeners from '@socket/useSocketListeners';
import { Communication } from '@editor/domain/communication';

export type CursorData = {
  id: string;
  range: Range | null;
  color: string;
};

export function useCursors(communication: Communication) {
  const [cursors, setCursors] = useState<CursorData[]>([]);

  const onCursorChange = (cursor: CursorData) => {
    setCursors(prevCursors => {
      if (!cursor.range) return prevCursors;
      const otherCursors = prevCursors.filter(c => c.id !== cursor.id);
      return [...otherCursors, cursor];
    });
  };

  useSocketListeners(communication, {
    cursorChange: onCursorChange,
  });

  return { cursors };
}

export default useCursors;
