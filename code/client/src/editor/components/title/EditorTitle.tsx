import React, { useState } from 'react';
import { Document } from '../../../../../shared/crdt/types/document';
import useSocketListeners from '@socket/useSocketListeners';
import { ReactEditor, useSlate } from 'slate-react';
import { Socket } from 'socket.io-client';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  socket: Socket;
}

function EditorTitle(props: InputProps) {
  const [title, setTitle] = useState('');
  const editor = useSlate();

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setTitle(value);
  }

  function onConfirm() {
    props.socket.emit('titleChange', title);
  }

  function onDocument({ title }: Document) {
    setTitle(title);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      onConfirm();
      ReactEditor.focus(editor);
    }
  }

  useSocketListeners(props.socket, {
    document: onDocument,
    titleChange: setTitle,
  });

  return (
    <input
      className={'title'}
      value={title}
      onInput={onInput}
      onBlur={onConfirm}
      onKeyDown={onKeyDown}
      spellCheck={false}
      {...props}
    />
  );
}

export default EditorTitle;
