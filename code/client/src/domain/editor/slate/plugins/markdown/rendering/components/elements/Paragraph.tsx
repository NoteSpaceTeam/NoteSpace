import React from 'react';

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function Paragraph(props: ParagraphProps) {
  return <p {...props}>{props.children}</p>;
}

export default Paragraph;
