import React from 'react';

interface Heading4Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function Heading4(props: Heading4Props) {
  return <h4 {...props}>{props.children}</h4>;
}

export default Heading4;
