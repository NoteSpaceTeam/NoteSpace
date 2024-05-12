import { useEffect, useRef, useState } from 'react';

function useEditing(initialValue: string, onEdit: (value: string) => void) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<HTMLSpanElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // listen for changes in the initial value
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    // set the cursor at the end of the title when editing
    if (isEditing && ref.current) {
      const range = document.createRange();
      const sel = window.getSelection();
      const childNodes = ref.current.childNodes;
      if (!sel || childNodes.length === 0) return;
      range.setStart(ref.current.childNodes[0], value.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [value, isEditing]);

  const component = (
    <span
      ref={ref}
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onInput={e => setValue(e.currentTarget.innerText)}
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
    >
      {value}
    </span>
  );

  return {
    component,
    isEditing,
    setIsEditing,
  };
}

export default useEditing;
