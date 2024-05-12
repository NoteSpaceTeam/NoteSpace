import React, { useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Communication } from '@/services/communication/communication';
import { useParams } from 'react-router-dom';
import useSocketListeners from '@/services/communication/socket/useSocketListeners.ts';
import { WorkspaceResource } from '@notespace/shared/src/workspace/types/resource.ts';

interface TitleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  communication: Communication;
}

function Title(props: TitleProps) {
  const editor = useSlate();
  const { wid, id } = useParams();
  const { http, socket } = props.communication;
  const [title, setTitle] = useState(props.title);
  const [prevTitle, setPrevTitle] = useState(props.title);

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setTitle(value);
  }

  async function onConfirm() {
    if (title === prevTitle) return;
    await http.put(`/workspaces/${wid}/${id}`, { name: title });
    setPrevTitle(title);
  }

  async function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      await onConfirm();
      ReactEditor.focus(editor);
    }
  }

  function onResourceUpdated(resource: Partial<WorkspaceResource>) {
    const newName = resource.name || title;
    if (resource.id === id && newName !== title) {
      setTitle(newName);
      setPrevTitle(newName);
    }
  }

  useSocketListeners(socket, {
    resourceUpdated: onResourceUpdated,
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
