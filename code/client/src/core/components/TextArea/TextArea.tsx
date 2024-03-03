import React, { useRef } from 'react';
import useAutosize from '../../hooks/useAutosize.ts';
import './TextArea.scss';

type TextAreaProps = {
  value: string;
  onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onKeyUp: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onMouseUp: React.MouseEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
};

function TextArea({ value, onKeyDown, onKeyUp, onMouseUp, onChange, placeholder }: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosize(textAreaRef.current, value);
  return (
    <textarea
      spellCheck={false}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onMouseUp={onMouseUp}
      onChange={onChange}
      placeholder={placeholder || ''}
      ref={textAreaRef}
      rows={1}
      value={value}
      autoFocus={true}
    />
  );
}

export default TextArea;
