import { Range } from 'slate';
import { useState } from 'react';
import useSocketListeners from '@socket/useSocketListeners';
import { Communication } from '@editor/domain/communication';
import { InlineStyle } from '@notespace/shared/types/styles';

export type CursorData = {
  id: string;
  range: Range | null;
  color: string;
  styles: InlineStyle[];
};

export function useCursors(communication: Communication) {
  const [cursors, setCursors] = useState<CursorData[]>([]);

  const onCursorChange = (cursor: CursorData) => {
    setCursors(prevCursors => {
      const otherCursors = prevCursors.filter(c => c.id !== cursor.id);
      if (!cursor.range) return otherCursors;
      return [...otherCursors, cursor];
    });
  };

  useSocketListeners(communication, {
    cursorChange: onCursorChange,
  });

  return { cursors };
}

export default useCursors;
