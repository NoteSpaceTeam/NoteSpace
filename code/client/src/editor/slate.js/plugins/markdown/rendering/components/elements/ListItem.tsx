import React from 'react';

interface ListItemProps {
  attributes: NonNullable<unknown>;
  children?: React.ReactNode;
}

function ListItem({ attributes, children }: ListItemProps) {
  const styles = {
    paddingLeft: 10,
  };
  return (
    <li style={styles} {...attributes}>
      {children}
    </li>
  );
}

export default ListItem;
