import { ReactNode } from 'react';
import { InlineStyle } from '@notespace/shared/types/styles.ts';

type CursorProps = {
  children: ReactNode;
  color: string;
  styles: InlineStyle[];
};

function Cursor({ children, color, styles }: CursorProps) {
  const width = styles.includes('bold') ? '1.5px' : '1px';
  const angle = styles.includes('italic') ? '11deg' : '0deg';
  return (
    <span
      style={{
        outline: `${width} solid ${color}`,
        transform: `rotate(${angle})`,
      }}
    >
      {children}
    </span>
  );
}

export default Cursor;
