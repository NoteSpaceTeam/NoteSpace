import React, { useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { useParams } from 'react-router-dom';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { Resource } from '@notespace/shared/src/workspace/types/resource';
import useDocumentService from '@services/resource/useResourcesService';
import { ServiceConnector } from '@domain/editor/connectors/service/connector';

interface TitleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  connector: ServiceConnector;
}

function Title(props: TitleProps) {
  const editor = useSlate();
  const { id } = useParams();
  const initialTitle = props.title === 'Untitled' ? '' : props.title;
  const { communication } = props.connector;
  const [title, setTitle] = useState(initialTitle);
  const [prevTitle, setPrevTitle] = useState(initialTitle);
  const service = useDocumentService();

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setTitle(value);
  }

  async function onConfirm() {
    if (title === prevTitle) return;
    const newTitle = title.trim() || 'Untitled';
    await service.updateResource(id!, { name: newTitle });
    setPrevTitle(newTitle);
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
      const newTitle = newName === 'Untitled' ? '' : newName;
      setTitle(newTitle);
      setPrevTitle(newTitle);
    }
  }

  useSocketListeners(communication.socket, {
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
