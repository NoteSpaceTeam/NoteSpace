import { ReactNode } from 'react';

type SelectionProps = {
  color: string;
  children: ReactNode;
};

function Selection({ color, children }: SelectionProps) {
  return <span style={{ backgroundColor: color }}>{children}</span>;
}

export default Selection;
