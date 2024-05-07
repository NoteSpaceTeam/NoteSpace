import React from 'react';

interface NumberedListItemProps extends React.HTMLAttributes<HTMLLIElement> {}

function NumberedListItem(props: NumberedListItemProps) {
  const styles = {
    paddingLeft: 10,
    listStyleType: 'decimal',
  };
  return (
    <li style={styles} {...props}>
      {props.children}
    </li>
  );
}

export default NumberedListItem;
