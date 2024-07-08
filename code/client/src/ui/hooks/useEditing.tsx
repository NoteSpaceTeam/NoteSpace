import { useEffect, useState } from 'react';

function useEditing(initialValue: string, allowEdit: boolean, onEdit: (value: string) => void) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  // listen for changes in the initial value
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const component = isEditing ? (
    <input
      className="editable-text"
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onBlur={() => {
        onEdit(value);
        setIsEditing(false);
      }}
    />
  ) : (
    <span>{value || 'Untitled'}</span>
  );

  return {
    component,
    isEditing,
    setIsEditing: allowEdit ? setIsEditing : () => {},
  };
}

export default useEditing;
