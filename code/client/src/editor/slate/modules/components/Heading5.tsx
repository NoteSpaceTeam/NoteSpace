import React from 'react';

interface Heading5Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function Heading5(props: Heading5Props) {
  return <h5 {...props}>{props.children}</h5>;
}

export default Heading5;
