import React from 'react';

interface Heading4Props extends React.HTMLAttributes<HTMLHeadingElement> {}

function Heading4(props: Heading4Props) {
  return <h5 {...props}>{props.children}</h5>;
}

export default Heading4;
