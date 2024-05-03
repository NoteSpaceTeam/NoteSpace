import React from 'react';

interface Heading1Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function Heading1(props: Heading1Props) {
  return <h2 {...props}>{props.children}</h2>;
}

export default Heading1;
