import React from 'react';

interface Heading3Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function Heading3(props: Heading3Props) {
  return <h3 {...props}>{props.children}</h3>;
}

export default Heading3;
