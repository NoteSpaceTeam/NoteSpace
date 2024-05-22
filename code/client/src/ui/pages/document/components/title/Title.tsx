import React, { useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Communication } from '@services/communication/communication';
import { useParams } from 'react-router-dom';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { Resource } from '@notespace/shared/src/workspace/types/resource';
import useDocumentService from '@services/resource/useResourceService';

interface TitleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  communication: Communication;
}

function Title(props: TitleProps) {
  const editor = useSlate();
  const { id } = useParams();
  const { socket } = props.communication;
  const [title, setTitle] = useState(props.title);
  const [prevTitle, setPrevTitle] = useState(props.title);
  const service = useDocumentService();

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setTitle(value);
  }

  async function onConfirm() {
    if (title === prevTitle) return;
    await service.updateResource(id!, { name: title });
    setPrevTitle(title);
  }

  async function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      await onConfirm();
      ReactEditor.focus(editor);
    }
  }

  function onResourceUpdated(resource: Partial<Resource>) {
    const newName = resource.name || title;
    if (resource.id === id && newName !== title) {
      setTitle(newName);
      setPrevTitle(newName);
    }
  }

  useSocketListeners(socket, {
    updatedResource: onResourceUpdated,
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
