import React, { useEffect } from 'react';
import { useFocused, useSlate } from 'slate-react';
import CustomEditor from '@editor/slate/model/CustomEditor.ts';
import useSelection from '@editor/slate/hooks/useSelection.ts';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaCode } from 'react-icons/fa';
import { type Fugue } from '@editor/crdt/fugue.ts';

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

interface ToolbarProps {
  fugue: Fugue;
}

function Toolbar({ fugue }: ToolbarProps) {
  const editor = useSlate();
  const focused = useFocused();
  const {isSelected:selected} = useSelection(editor)
  const [selectionBounds, setSelectionBounds] = React.useState<DOMRect | null>(null);

  useEffect(() => {
    const getCurrentAbsolutePosition = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectionBounds(rect);
      } else {
        setSelectionBounds(null);
      }
    };
    window.addEventListener('mouseup', getCurrentAbsolutePosition);
    return () => {
      window.removeEventListener('mouseup', getCurrentAbsolutePosition);
    };
  }, []);

  const handleMarkMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, mark: MarkOption) => {
    e.preventDefault();
    e.stopPropagation();
    CustomEditor.toggleMark(editor, mark.value, fugue);
  };

  if (!selectionBounds || !selected || !focused) return null;
  const position = {
    top: selectionBounds.top - 50,
    left: selectionBounds.left,
  };
  return (
    <div
      className="toolbar"
      style={{
        position: 'absolute',
        ...position,
      }}
    >
      {markOptions.map(mark => (
        <button
          key={mark.value}
          onMouseDown={e => {
            handleMarkMouseDown(e, mark);
          }}
          className={CustomEditor.isMarkActive(editor, mark.value) ? 'active item' : 'item'}
        >
          {mark.icon}
        </button>
      ))}
    </div>
  );
}

export default Toolbar;
