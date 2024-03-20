import { ReactNode } from 'react';

interface CodeProps {
  children?: ReactNode;
}

function Code(props: CodeProps) {
  return <code>{props.children}</code>;
}

export default Code;
