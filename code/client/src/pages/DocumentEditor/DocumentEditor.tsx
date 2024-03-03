import React, { useEffect, useState } from 'react';
import './DocumentEditor.scss';
import Textarea from '../../core/components/TextArea/TextArea.tsx';
import useSocketListeners from '../../core/hooks/useSocketListeners.ts';
import { socket } from '../../socket/socket.ts';
import { getCursorPosition, getTagValue } from '../../core/utils.ts';
import useWaypointFugue from '../../core/hooks/fugue/useWaypointFugue.ts';
import Cursors from '../Cursors/Cursors.tsx';
import useKeyHandlers from '../../core/hooks/useKeyHandlers.ts';

export default function DocumentEditor() {
  const [text, setText] = useState('');
  const [operationBuffer, setOperationBuffer] = useState<OperationData[]>([]);
  const { elements, setElements, operations, sortTree } = useWaypointFugue();
  const { onKeyDown, onKeyUp } = useKeyHandlers(operations);

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

  function onOperation(operation: OperationData) {
    setOperationBuffer(prev => [...prev, operation]);
  }

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

  const handleCursorPositionChange = (e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => {
    const position = getCursorPosition(e.currentTarget);
    socket.emit('cursorChange', position);
  };

  return (
    <div className="editor">
      <header>
        <span className="fa fa-bars"></span>
        <h1>NoteSpace</h1>
      </header>
      <div className="container">
        <Textarea
          value={text}
          onKeyDown={e => onKeyDown(e.key)}
          onKeyUp={e => onKeyUp(e.key)}
          onMouseUp={handleCursorPositionChange}
          onChange={e => setText(e.target.value)}
          placeholder={'Start writing...'}
        />
        <Cursors />
      </div>
    </div>
  );
}
