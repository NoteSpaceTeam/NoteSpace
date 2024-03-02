import { useEffect, useState } from 'react';
import './DocumentEditor.scss';
import Textarea from '../../core/components/TextArea/TextArea.tsx';
import useSocketListeners from '../../core/hooks/useSocketListeners.ts';
import { socket } from '../../socket/socket.ts';
//import useFugueSimple from '../../core/hooks/fugue/useFugueSimple.ts';
import { getTagValue } from '../../core/utils.ts';
import useWaypointFugue from '../../core/hooks/fugue/useWaypointFugue.ts';

export default function DocumentEditor() {
  const { elements, setElements, operations, sortTree } = useWaypointFugue();
  const [text, setText] = useState('');

  // useEffect(() => {
  //   async function getDocument() {
  //     const response = await fetch('http://localhost:8080/document');
  //     const data = await response.json();
  //     setElements(data.content);
  //   }
  //   getDocument();
  // }, [setElements]);


  function onKeyPressed(key: string) {
    const textarea = document.querySelector('textarea')!;
    const selectionStart = textarea.selectionStart;
    // const selectionEnd = textarea.selectionEnd;
    switch (key) {
      case 'Backspace': {
        const character = operations.deleteLocal(selectionStart);
        if (character === '') return;
        socket.emit('operation', { type: 'delete', character });
        break;
      }
      default: {
        if (key !== 'Enter' && key.length > 1) return;
        const char = key === 'Enter' ? '\n' : key;
        const character = operations.insertLocal(char, selectionStart);
        socket.emit('operation', { type: 'insert', character });
        break;
      }
    }
  }

  function onOperation({ type, character }: OperationData) {
    switch (type) {
      case 'insert': {
        operations.insertRemote(character);
        break;
      }
      case 'delete': {
        operations.deleteRemote(character);
        break;
      }
    }
  }

  useSocketListeners({
    operation: onOperation,
    reconnect: () => console.log('reconnected'),
    document: (data) => setElements(data),
  });

  function setTextFromCharacters(chars: string[]) {
    const txt = sortTree(chars).map(getTagValue).join('');
    setText(txt);
  }

  useEffect(() => {
    setTextFromCharacters(elements.filter((c) => !c.endsWith('⊥')));
  }, [elements]);

  return (
      <div className="editor">
        <h1>
          <a href="/">NoteSpace</a>
        </h1>
        <div className="container">
          <Textarea
              value={text}
              onKeyDown={e => onKeyPressed(e.key)}
              onChange={e => setText(e.target.value)}
          />
        </div>
      </div>
  );
}
