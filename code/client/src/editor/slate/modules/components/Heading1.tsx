import React from 'react';

interface Heading1Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function Heading1(props: Heading1Props) {
  return <h1 {...props}>{props.children}</h1>;
}

export default Heading1;
