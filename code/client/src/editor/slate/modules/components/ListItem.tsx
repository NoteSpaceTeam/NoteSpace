import React from 'react';

interface ListElementProps {
  attributes: NonNullable<unknown>;
  children: React.ReactNode;
}

function ListElement({ attributes, children }: ListElementProps) {
  const styles = {
    // paddingLeft: 20,
  }
  return (
    <li style={styles} {...attributes}>
      {children}
    </li>
  );
}

export default ListElement;
