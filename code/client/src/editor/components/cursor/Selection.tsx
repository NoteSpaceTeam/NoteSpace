import { ReactNode } from 'react';

type SelectionProps = {
  color: string;
  children: ReactNode;
};

function Selection({ color, children }: SelectionProps) {
  return <span style={{ backgroundColor: color, whiteSpace: 'nowrap' }}>{children}</span>;
}

export default Selection;
