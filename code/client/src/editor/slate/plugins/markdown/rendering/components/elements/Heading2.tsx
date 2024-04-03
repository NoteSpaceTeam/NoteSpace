import React from 'react';

interface Heading2Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function Heading2(props: Heading2Props) {
  return <h3 {...props}>{props.children}</h3>;
}

export default Heading2;
