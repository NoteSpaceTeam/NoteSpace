import { useEffect, useState } from 'react';
import './DocumentEditor.scss';
import Textarea from '../../core/components/TextArea/TextArea.tsx';
import useSocketListeners from '../../core/hooks/useSocketListeners.ts';
import { socket } from '../../socket/socket.ts';
import { getTagValue } from '../../core/utils.ts';
import useWaypointFugue from '../../core/hooks/fugue/useWaypointFugue.ts';

export default function DocumentEditor() {
  const { elements, setElements, operations, sortTree } = useWaypointFugue();
  const [text, setText] = useState('');
  const [operationBuffer, setOperationBuffer] = useState<OperationData[]>([]);

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

  function onOperation(operation: OperationData) {
    console.log('operation', operation);
    setOperationBuffer(prev => [...prev, operation]);
  }

  useEffect(() => {
    function operationHandler({ type, character }: OperationData) {
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
    if (operationBuffer.length === 0) return;
    operationHandler(operationBuffer[0]);
    setOperationBuffer(prev => prev.slice(1));
  }, [operationBuffer, operations]);

  function onDocument(content: string[]) {
    setElements(prev => {
      const unique = [...new Set(prev.concat(content))];
      return sortTree(unique.filter(c => !c.endsWith('⊥')));
    });
  }

  useSocketListeners({
    operation: onOperation,
    document: onDocument,
  });

  useEffect(() => {
    function setTextFromCharacters(chars: string[]) {
      const txt = sortTree(chars).map(getTagValue).join('');
      setText(txt);
    }
    setTextFromCharacters(elements.filter(c => !c.endsWith('⊥')));
  }, [elements, sortTree]);

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
