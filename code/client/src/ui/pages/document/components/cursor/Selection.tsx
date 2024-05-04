import { ReactNode } from 'react';

type SelectionProps = {
  hue: string;
  children: ReactNode;
};

function Selection({ hue, children }: SelectionProps) {
  const color = `hsl(${hue}, 100%, 75%)`;
  return <span style={{ backgroundColor: color }}>{children}</span>;
}

export default Selection;
