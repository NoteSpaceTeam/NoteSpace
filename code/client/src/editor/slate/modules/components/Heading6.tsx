import React from 'react';

interface Heading6Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function Heading6(props: Heading6Props) {
  return <h6 {...props}>{props.children}</h6>;
}

export default Heading6;
