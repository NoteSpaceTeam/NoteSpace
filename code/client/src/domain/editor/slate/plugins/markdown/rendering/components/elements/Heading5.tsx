import React from 'react';

interface Heading5Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function Heading5(props: Heading5Props) {
  return <h6 {...props}>{props.children}</h6>;
}

export default Heading5;
