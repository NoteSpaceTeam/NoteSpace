import { useEffect, useState } from 'react';
import './DocumentEditor.scss';
import Textarea from '../../core/components/TextArea/TextArea.tsx';
import useSocketListeners from '../../core/hooks/useSocketListeners.ts';
import { socket } from '../../socket/socket.ts';
import useFugueCRDT from '../../core/hooks/useFugueCRDT.ts';
import { getTagId, getTagValue, sortByTagId } from '../../core/utils.ts';

export default function DocumentEditor() {
  const { characters, setCharacters, operations } = useFugueCRDT();
  const [text, setText] = useState('');

  useEffect(() => {
    async function getDocument() {
      const response = await fetch('http://localhost:8080/document');
      const data = await response.json();
      setCharacters(data.content);
    }
    getDocument();
  }, [setCharacters]);

  function onKeyPressed(key: string) {
    const textarea = document.querySelector('textarea')!;
    const selectionStart = textarea.selectionStart;
    // const selectionEnd = textarea.selectionEnd;
    switch (key) {
      case 'Backspace': {
        const character = operations.deleteLocal(selectionStart);
        setCharacters(prev => prev.filter(c => getTagId(c) !== getTagId(character)));
        socket.emit('operation', { type: 'delete', character });
        break;
      }
      default: {
        if (key !== 'Enter' && key.length > 1) return;
        const char = key === 'Enter' ? '\n' : key;
        const character = operations.insertLocal(char, selectionStart);
        setCharacters(prev => [...prev, character]);
        socket.emit('operation', { type: 'insert', character });
        break;
      }
    }
  }

  function onOperation({ type, character }: OperationData) {
    switch (type) {
      case 'insert': {
        const newChars = operations.insertRemote(character);
        setCharacters(newChars);
        break;
      }
      case 'delete': {
        const newChars = operations.deleteRemote(character);
        setCharacters(newChars);
        break;
      }
    }
  }

  useSocketListeners({
    operation: onOperation,
  });

  function setTextFromCharacters(chars: string[]) {
    const txt = sortByTagId(chars).map(getTagValue).join('');
    setText(txt);
  }

  useEffect(() => {
    setTextFromCharacters(characters);
  }, [characters]);

  return (
    <div className="editor">
      <h1>
        <a href="/">NoteSpace</a>
      </h1>
      <div className="container">
        <Textarea value={text} onKeyDown={e => onKeyPressed(e.key)} onChange={e => setText(e.target.value)} />
      </div>
    </div>
  );
}
