import { Range } from 'slate';
import { useState } from 'react';
import useSocketListeners from '@/domain/communication/socket/useSocketListeners.ts';
import { Communication } from '@/domain/communication/communication.ts';
import { InlineStyle } from '@notespace/shared/types/styles.ts';

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
