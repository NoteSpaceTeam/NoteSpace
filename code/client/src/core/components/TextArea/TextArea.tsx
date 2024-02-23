import React, { useRef } from 'react';
import useAutosize from '../../hooks/useAutosize.ts';
import './TextArea.scss';

type TextAreaProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function TextArea({ value, onChange, placeholder }: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosize(textAreaRef.current, value);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target?.value);
  };
  return (
    <textarea
      spellCheck={false}
      onChange={handleChange}
      placeholder={placeholder || ''}
      ref={textAreaRef}
      rows={1}
      value={value}
    />
  );
}

export default TextArea;
