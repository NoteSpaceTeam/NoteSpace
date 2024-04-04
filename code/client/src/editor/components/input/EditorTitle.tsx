import React, { useState } from 'react';
import { socket } from '@src/socket/socket.ts';
import { Document } from '../../../../../shared/crdt/types/document.ts';
import useSocketListeners from '@src/socket/useSocketListeners.ts';
import { ReactEditor, useSlate } from 'slate-react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function EditorTitle(props: InputProps) {
  const [title, setTitle] = useState('');
  const editor = useSlate();

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setTitle(value);
  }

  function onConfirm() {
    socket.emit('titleChange', title);
  }

  function onDocument({ title }: Document) {
    setTitle(title);
  }

  function onTitleChange(newTitle: string) {
    setTitle(newTitle);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm();
      ReactEditor.focus(editor);
    }
  }

  useSocketListeners({
    document: onDocument,
    titleChange: onTitleChange,
  });

  return (
    <input value={title} onInput={onInput} onBlur={onConfirm} onKeyDown={onKeyDown} spellCheck={false} {...props} />
  );
}

export default EditorTitle;
