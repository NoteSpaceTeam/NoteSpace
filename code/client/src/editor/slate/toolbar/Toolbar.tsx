import React, { CSSProperties, useEffect, useState } from 'react';
import { useFocused, useSlate } from 'slate-react';
import CustomEditor from '@editor/slate/model/CustomEditor';
import { isSelected } from '@editor/slate/utils/selection';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaCode } from 'react-icons/fa';

interface MarkOption {
  value: string;
  icon: React.ReactElement;
}

const markOptions: MarkOption[] = [
  { value: 'bold', icon: <FaBold /> },
  { value: 'italic', icon: <FaItalic /> },
  { value: 'underline', icon: <FaUnderline /> },
  { value: 'strikethrough', icon: <FaStrikethrough /> },
  { value: 'code', icon: <FaCode /> },
];

function Toolbar() {
  const editor = useSlate(),
    focused = useFocused(),
    selected = isSelected(editor);
  const [selectionBounds, setSelectionBounds] = useState<DOMRect | null>(null);

  useEffect(() => {
    const getCurrentAbsolutePosition = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectionBounds(rect);
      } else setSelectionBounds(null);
    };
    window.addEventListener('mouseup', getCurrentAbsolutePosition);
    return () => window.removeEventListener('mouseup', getCurrentAbsolutePosition);
  }, []);

  const handleMarkMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, mark: MarkOption) => {
    e.preventDefault();
    e.stopPropagation();
    CustomEditor.toggleMark(editor, mark.value);
  };

  if (!selectionBounds || !selected || !focused) return null;

  const position = {
    top: selectionBounds.top - 50,
    left: selectionBounds.left,
  };

  const toolbarStyle: CSSProperties = {
    position: 'absolute',
    ...position,
  };

  const onMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, mark: MarkOption) =>
    handleMarkMouseDown(e, mark);

  const getClassName = (mark: MarkOption) => (CustomEditor.isMarkActive(editor, mark.value) ? 'active item' : 'item');

  return (
    <div className="toolbar" style={toolbarStyle}>
      {markOptions.map(mark => (
        <button key={mark.value} onMouseDown={e => onMouseDown(e, mark)} className={getClassName(mark)}>
          {mark.icon}
        </button>
      ))}
    </div>
  );
}

export default Toolbar;
