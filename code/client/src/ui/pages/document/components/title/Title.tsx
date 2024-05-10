import React, { useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Communication } from '@/services/communication/communication';
import useWorkspace from '@domain/workspace/useWorkspace';

interface TitleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  communication: Communication;
}

function Title(props: TitleProps) {
  const [title, setTitle] = useState(props.title);
  const [prevTitle, setPrevTitle] = useState(props.title);
  const editor = useSlate();
  const { http } = props.communication;
  const { setFilePath } = useWorkspace();

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setTitle(value);
  }

  function onConfirm() {
    if (title === prevTitle) return;
    // await http.put(`/documents/${title}`);
    setPrevTitle(title);
    setFilePath(`/documents/${title || 'Untitled'}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm();
      ReactEditor.focus(editor);
    }
  }

  // useSocketListeners(socket, {
  //   'document:title': setTitle,
  // });

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
