import React, { useState } from 'react';
import { Document } from '@notespace/shared/crdt/types/document';
import useSocketListeners from '@socket/useSocketListeners';
import { ReactEditor, useSlate } from 'slate-react';
import useCommunication from '@editor/hooks/useCommunication';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function EditorTitle(props: InputProps) {
  const [title, setTitle] = useState('');
  const editor = useSlate();
  const { emit } = useCommunication();

  function onInput(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setTitle(value);
  }

  function onConfirm() {
    emit('titleChange', title);
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

  useSocketListeners({
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
