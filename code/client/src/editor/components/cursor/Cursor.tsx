import { ReactNode } from 'react';

type CursorProps = {
  children: ReactNode;
  color: string;
};

function Cursor({ children, color }: CursorProps) {
  return (
    <span
      style={{
        zIndex: -1,
        outline: `1px solid ${color}`,
      }}
    >
      {children}
    </span>
  );
}

export default Cursor;
