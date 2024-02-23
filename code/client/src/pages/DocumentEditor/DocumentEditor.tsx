import React, {useEffect} from 'react';
import './DocumentEditor.scss';
import Textarea from '../../core/components/TextArea/TextArea.tsx';
import useKeyboardInput from "../../core/hooks/useKeyboardInput.ts";
import useSocketListeners from "../../core/hooks/useSocketListeners.ts";
import {socket} from "../../socket/socket.ts";

export default function DocumentEditor() {
  const [text, setText] = React.useState('');
  const [key, setKey] = useKeyboardInput()

  useEffect(() => {
    if (key === null || key === 'Control') return
    const cursorIndex = document.querySelector('textarea')?.selectionStart
    switch(key) {
      case 'Backspace':
        socket.emit('delete', {index: cursorIndex})
        break
      case 'Enter':
        socket.emit('enter', {index: cursorIndex})
        break
      default:
        socket.emit('insert', { char: key, index: cursorIndex })
    
      setKey(null)
    }
  }, [key, setKey]);

  function onInsert({char, index}: onInsertData) {
    setText(text.slice(0, index) + char + text.slice(index))
  }

  function onDelete({index}: onDeleteData) {
    setText(text.slice(0, index - 1) + text.slice(index))
  }

  function onEnter({index}: onEnterData) {
    setText(text.slice(0, index) + '\n' + text.slice(index))
  }

  useSocketListeners({
    'insert': onInsert,
    'delete': onDelete,
    'enter': onEnter
  })

  return (
    <div className="editor">
      <h1>NoteSpace</h1>
      <div className="container">
        <Textarea value={text} onChange={setText} />
      </div>
    </div>
  );
}
