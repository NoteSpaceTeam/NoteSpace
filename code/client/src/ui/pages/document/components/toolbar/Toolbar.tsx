import React, { CSSProperties, useEffect, useState } from 'react';
import { useFocused, useSlate } from 'slate-react';
import CustomEditor from '@/domain/editor/slate/CustomEditor';
import { isSelected } from '@/domain/editor/slate/utils/selection';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaCode } from 'react-icons/fa';
import { InlineStyle } from '@notespace/shared/types/styles';

type ToolbarProps = {
  onApplyMark: (mark: InlineStyle) => void;
};

function Toolbar({ onApplyMark }: ToolbarProps) {
  const editor = useSlate();
  const focused = useFocused();
  const selected = isSelected(editor);
  const [selectionBounds, setSelectionBounds] = useState<DOMRect | null>(null);

  useEffect(() => {
    const getSelectionBounds = () => {
      const selection = window.getSelection();

      if (!selection || selection.rangeCount <= 0) {
        setSelectionBounds(null);
        return;
      }

      const range = selection.getRangeAt(0);
      if (!range.getBoundingClientRect) return;
      const rect = range.getBoundingClientRect();
      setSelectionBounds(rect);
    };
    window.addEventListener('mouseup', getSelectionBounds);

    return () => window.removeEventListener('mouseup', getSelectionBounds);
  }, []);

  const handleMarkMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, mark: MarkOption) => {
    e.preventDefault();
    e.stopPropagation();
    onApplyMark(mark.value);
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

  return (
    <div className="toolbar" style={toolbarStyle}>
      {markOptions.map(mark => (
        <button
          key={mark.value}
          onMouseDown={e => handleMarkMouseDown(e, mark)}
          className={CustomEditor.isMarkActive(editor, mark.value) ? 'active item' : 'item'}
        >
          {mark.icon}
        </button>
      ))}
    </div>
  );
}

interface MarkOption {
  value: InlineStyle;
  icon: React.ReactElement;
}

const markOptions: MarkOption[] = [
  { value: 'bold', icon: <FaBold /> },
  { value: 'italic', icon: <FaItalic /> },
  { value: 'underline', icon: <FaUnderline /> },
  { value: 'strikethrough', icon: <FaStrikethrough /> },
  { value: 'code', icon: <FaCode /> },
];

export default Toolbar;
