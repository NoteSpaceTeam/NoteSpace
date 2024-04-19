import { ReactNode } from 'react';

type CursorProps = {
  children: ReactNode;
  color: string;
};

function Cursor({ children, color }: CursorProps) {
  return (
    <span
      style={{
        position: 'relative',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          top: '0',
          left: '1px',
          height: '100%',
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
