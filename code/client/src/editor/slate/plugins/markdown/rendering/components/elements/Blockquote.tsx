import React from 'react';

interface BlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {}

function Blockquote(props: BlockquoteProps) {
  const styles = {
    borderLeft: `3px solid #ccc`,
    paddingLeft: 20,
    margin: 0,
  };

  return (
    <blockquote style={styles} {...props}>
      {props.children}
    </blockquote>
  );
}

export default Blockquote;
