import { ReactNode } from 'react';

type CursorProps = {
  children: ReactNode;
  color: string;
};

function Cursor({ children, color }: CursorProps) {
  return (
    <span style={{ position: 'relative' }}>
      {children}
      <span
        style={{
          position: 'absolute',
          top: '-2px',
          left: '1px',
          height: '1.5em',
          width: '2px',
          backgroundColor: color,
          transform: 'translateX(-100%)',
          zIndex: -1,
        }}
      />
    </span>
  );
}

export default Cursor;
