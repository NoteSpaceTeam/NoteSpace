import React, { useState } from 'react';
import useSocketListeners from '@communication/socket/useSocketListeners.ts';
import { ReactEditor, useSlate } from 'slate-react';
import { Communication } from '@communication/communication.ts';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  communication: Communication;
}

function EditorTitle(props: InputProps) {
  const [title, setTitle] = useState(props.title);
  const [prevTitle, setPrevTitle] = useState(props.title);
  const editor = useSlate();
  const { socket } = props.communication;

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setTitle(value);
  }

  function onConfirm() {
    if (title === prevTitle) return;
    socket.emit('titleChange', title);
    setPrevTitle(title);
  }

  function onSubmit(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    onConfirm();
    ReactEditor.focus(editor);
  }

  useSocketListeners(socket, {
    titleChange: setTitle,
  });

  return (
    <input
      className={'title'}
      value={title}
      onInput={onInput}
      onBlur={onConfirm}
      onSubmit={onSubmit}
      spellCheck={false}
      {...props}
    />
  );
}

export default EditorTitle;
