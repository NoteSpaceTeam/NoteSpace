import React from 'react';
import { useSlate } from 'slate-react';
import CustomEditor from '@src/editor/slate/modules/CustomEditor.tsx';

interface MarkOption {
  value: string;
  icon: JSX.Element;
}

const markOptions: MarkOption[] = [
  { value: `bold`, icon: <span>B</span> },
  { value: `italic`, icon: <span>I</span> },
  { value: `underline`, icon: <span>U</span> },
  { value: `strikethrough`, icon: <span>$</span> },
  { value: `code`, icon: <span>{`<>`}</span> },
];

const Static: React.FC = () => {
  const editor = useSlate();

  const handleMarkMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, mark: MarkOption) => {
    e.stopPropagation();
    CustomEditor.toggleMark(editor, mark.value);
  };

  return (
    <div>
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
};

export default Static;
