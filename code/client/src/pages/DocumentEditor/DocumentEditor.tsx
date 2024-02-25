import React, { useEffect } from 'react';
import './DocumentEditor.scss';
import Textarea from '../../core/components/TextArea/TextArea.tsx';
import useKeyboardInput from '../../core/hooks/useKeyboardInput.ts';
import useSocketListeners from '../../core/hooks/useSocketListeners.ts';
import { socket } from '../../socket/socket.ts';

export default function DocumentEditor() {
  const [text, setText] = React.useState('');
  const [key, setKey] = useKeyboardInput();

  async function getDocument() {
    const response = await fetch('http://localhost:8080/document');
    const data = await response.json();
    console.log('data: ', data);
    setText(data.content);
  }

  useEffect(() => {
    getDocument();
  }, []);

  useEffect(() => {
    console.info('key: ', key);
    if (key === null || key === 'Control') return;

    const cursorIndex = document.querySelector('textarea')?.selectionStart;
    switch (key) {
      case 'Backspace':
        socket.emit('operation', { type: 'delete', index: cursorIndex });
        break;
      case 'Enter':
        socket.emit('operation', { type: 'enter', index: cursorIndex });
        break;
      default:
        socket.emit('operation', { type: 'insert', char: key, index: cursorIndex });
    }
    setKey(null);
  }, [key, setKey]);

  function onOperation({ type, index, char }: OperationData) {
    switch (type) {
      case 'insert':
        setText(text.slice(0, index) + char + text.slice(index));
        break;
      case 'delete':
        setText(text.slice(0, index));
        break;
      case 'enter':
        setText(text.slice(0, index) + '\n' + text.slice(index));
        break;
    }
  }

  useSocketListeners({
    operation: onOperation,
  });

  return (
    <div className="editor">
      <h1>NoteSpace</h1>
      <div className="container">
        <Textarea value={text} onChange={setText} />
      </div>
    </div>
  );
}
