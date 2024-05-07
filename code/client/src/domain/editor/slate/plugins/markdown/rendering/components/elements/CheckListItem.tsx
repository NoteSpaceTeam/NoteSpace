import React, { useState } from 'react';

interface CheckListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  active: boolean;
  onToggle: (checked: boolean) => void;
}

function CheckListItem(props: CheckListItemProps) {
  const { active, onToggle, ...rest } = props;
  const [checked, setChecked] = useState(active);
  const handleCheck = () => {
    onToggle(!checked);
    setChecked(!checked);
  };
  const styles = {
    paddingLeft: 10,
    listStyle: 'none',
  };
  return (
    <li {...rest} style={styles}>
      <input type="checkbox" checked={checked} onChange={handleCheck} />
      {props.children}
    </li>
  );
}

export default CheckListItem;
