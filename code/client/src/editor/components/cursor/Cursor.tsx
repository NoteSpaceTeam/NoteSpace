import { ReactNode } from 'react';
import { InlineStyle } from '../../../../../shared/types/styles';

type CursorProps = {
  children: ReactNode;
  color: string;
  styles: InlineStyle[];
};

function Cursor({ children, color, styles }: CursorProps) {
  const width = styles.includes('bold') ? '2px' : '1px';
  return (
    <span
      style={{
        zIndex: -1,
        outline: `${width} solid ${color}`,
      }}
    >
      {children}
    </span>
  );
}

export default Cursor;
