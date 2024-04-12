import React, { CSSProperties, useEffect, useState } from 'react';
import { useFocused, useSlate } from 'slate-react';
import CustomEditor from '@editor/slate/CustomEditor';
import { isSelected } from '@editor/slate/utils/selection';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaCode } from 'react-icons/fa';
import useCommunication from '@editor/hooks/useCommunication';
import { Fugue } from '@editor/crdt/Fugue';

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

type ToolbarProps = {
  fugue: Fugue;
};

function Toolbar({ fugue }: ToolbarProps) {
  const editor = useSlate();
  const focused = useFocused();
  const selected = isSelected(editor);
  const { emitChunked } = useCommunication();
  const [selectionBounds, setSelectionBounds] = useState<DOMRect | null>(null);

  useEffect(() => {
    /**
     * Get the current selection bounds
     */
    const getCurrentAbsolutePosition = () => {
      const selection = window.getSelection();

      if (!selection || selection.rangeCount <= 0) {
        setSelectionBounds(null);
        return;
      }

      const range = selection.getRangeAt(0);
      if (!range.getBoundingClientRect) return; // tests fail without this check
      const rect = range.getBoundingClientRect();
      setSelectionBounds(rect);
    };

    window.addEventListener('mouseup', getCurrentAbsolutePosition);
    return () => window.removeEventListener('mouseup', getCurrentAbsolutePosition);
  }, []);

  const handleMarkMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, mark: MarkOption) => {
    e.preventDefault();
    e.stopPropagation();
    const operations = CustomEditor.toggleMark(editor, mark.value, fugue);
    emitChunked('operation', operations);
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
