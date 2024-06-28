import { ReactNode } from 'react';
import { InlineStyle } from '@notespace/shared/src/document/types/styles';
import './Cursor.scss';

type CursorProps = {
  id: string;
  color: string;
  styles: InlineStyle[];
  children: ReactNode;
};

function Cursor({ children, styles, color, id }: CursorProps) {
  const width = styles.includes('bold') ? '1.5px' : '1px';
  const angle = styles.includes('italic') ? '11deg' : '0deg';
  return (
    <>
      <span
        id={id}
        className="cursor"
        style={{
          outline: `${width} solid ${color}`,
          transform: `rotate(${angle})`,
        }}
      />
      {children}
    </>
  );
}

export default Cursor;
