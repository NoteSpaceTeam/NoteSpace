import { Range } from 'slate';
import { useState } from 'react';
import { InlineStyle } from '@notespace/shared/src/document/types/styles';
import { ServiceConnector } from '@domain/editor/connectors/service/connector';

export type CursorData = {
  id: string;
  range: Range | null;
  color: string;
  styles: InlineStyle[];
};

export function useCursors(connector: ServiceConnector) {
  const [cursors, setCursors] = useState<CursorData[]>([]);

  const onCursorChange = (cursor: CursorData) => {
    setCursors(prevCursors => {
      const otherCursors = prevCursors.filter(c => c.id !== cursor.id);
      if (!cursor.range) return otherCursors;
      return [...otherCursors, cursor];
    });
  };
  connector.on('cursorChange', onCursorChange);
  return { cursors };
}

export default useCursors;
