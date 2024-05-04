import { ReactNode } from 'react';
import { InlineStyle } from '@notespace/shared/types/styles';
import './Cursor.scss';

type CursorProps = {
  hue: string;
  styles: InlineStyle[];
  isSelection: boolean;
  children: ReactNode;
};

function Cursor({ children, hue, styles, isSelection }: CursorProps) {
  const width = styles.includes('bold') ? '1.5px' : '1px';
  const angle = styles.includes('italic') ? '11deg' : '0deg';
  const color = `hsl(${hue}, 100%, 50%)`;
  return (
    <span
      className={!isSelection ? 'animate' : ''}
      style={{
        position: 'relative',
        outline: !isSelection ? `${width} solid ${color}` : 'none',
        boxShadow: `inset 1px 0 0 ${color}, -1px 0 0 ${color}`,
        transform: `rotate(${angle})`,
      }}
    >
      {children}
    </span>
  );
}

export default Cursor;
