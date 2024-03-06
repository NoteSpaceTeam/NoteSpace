import React, { useRef } from 'react';
import useAutosize from './useAutosize.ts';
import './TextArea.scss';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

function TextArea(props: TextAreaProps) {
  const { value, onKeyDown, onKeyUp, onChange, onMouseUp, placeholder, ...otherProps } = props;
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
      {...otherProps}
    />
  );
}

export default TextArea;
