import React, { useState } from 'react';
import useSocketListeners from '@/domain/communication/socket/useSocketListeners';
import { ReactEditor, useSlate } from 'slate-react';
import { Communication } from '@/domain/communication/communication';

interface TitleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  communication: Communication;
}

function Title(props: TitleProps) {
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

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm();
      ReactEditor.focus(editor);
    }
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
      onKeyDown={onKeyDown}
      spellCheck={false}
      maxLength={30}
      {...props}
    />
  );
}
export default Title;
