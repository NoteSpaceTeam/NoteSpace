import React from 'react';

interface Heading3Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function Heading3(props: Heading3Props) {
  return <h4 {...props}>{props.children}</h4>;
}

export default Heading3;
