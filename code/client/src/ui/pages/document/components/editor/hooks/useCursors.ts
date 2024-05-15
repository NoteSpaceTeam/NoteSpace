import { Range } from 'slate';
import { useState } from 'react';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { Communication } from '@services/communication/communication';
import { InlineStyle } from '@notespace/shared/src/document/types/styles';

export type CursorData = {
  id: string;
  range: Range | null;
  color: string;
  styles: InlineStyle[];
};

export function useCursors({ socket }: Communication) {
  const [cursors, setCursors] = useState<CursorData[]>([]);

  const onCursorChange = (cursor: CursorData) => {
    setCursors(prevCursors => {
      const otherCursors = prevCursors.filter(c => c.id !== cursor.id);
      if (!cursor.range) return otherCursors;
      return [...otherCursors, cursor];
    });
  };

  useSocketListeners(socket, {
    cursorChange: onCursorChange,
  });

  return { cursors };
}

export default useCursors;
