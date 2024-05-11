import React, { useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Communication } from '@/services/communication/communication';
import useWorkspace from '@domain/workspace/useWorkspace';
import { useParams } from 'react-router-dom';
import useSocketListeners from '@/services/communication/socket/useSocketListeners.ts';

interface TitleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  communication: Communication;
}

function Title(props: TitleProps) {
  const [title, setTitle] = useState(props.title);
  const [prevTitle, setPrevTitle] = useState(props.title);
  const editor = useSlate();
  const { wid, id } = useParams();
  const { http, socket } = props.communication;
  const { setFilePath } = useWorkspace();

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setTitle(value);
  }

  async function onConfirm() {
    if (title === prevTitle) return;
    await http.put(`/workspaces/${wid}/documents/${id}`, { name: title });
    setPrevTitle(title);
    setFilePath(`/documents/${title || 'Untitled'}`);
  }

  async function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      await onConfirm();
      ReactEditor.focus(editor);
    }
  }

  useSocketListeners(socket, {
    'document:title': setTitle,
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
