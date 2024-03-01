import React, { useRef } from 'react';
import useAutosize from '../../hooks/useAutosize.ts';
import './TextArea.scss';

type TextAreaProps = {
  value: string;
  onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
};

function TextArea({ value, onKeyDown, onChange, placeholder }: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosize(textAreaRef.current, value);
  return (
    <textarea
      spellCheck={false}
      onKeyDown={onKeyDown}
      onChange={onChange}
      placeholder={placeholder || ''}
      ref={textAreaRef}
      rows={1}
      value={value}
    />
  );
}

export default TextArea;
