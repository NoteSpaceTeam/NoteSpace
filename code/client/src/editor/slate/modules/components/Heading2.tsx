import React from 'react';

interface Heading2Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function Heading2(props: Heading2Props) {
  return <h2 {...props}>{props.children}</h2>;
}

export default Heading2;
