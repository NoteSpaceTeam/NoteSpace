import React from 'react';

interface ListItemProps {
  children?: React.ReactNode;
}

function ListItem(props: ListItemProps) {
  const styles = {
    paddingLeft: 10,
  };
  return (
    <div>
      <li style={styles} {...props}>
        {props.children}
      </li>
    </div>
  );
}

export default ListItem;
