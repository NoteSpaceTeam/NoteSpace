import React from 'react';

interface NumberedListItemProps {
  attributes: NonNullable<unknown>;
  children?: React.ReactNode;
}

function NumberedListElement({ attributes, children }: NumberedListItemProps) {
  const styles = {
    paddingLeft: 10,
  };
  return (
    <li style={styles} {...attributes}>
      {children}
    </li>
  );
}

export default NumberedListElement;
