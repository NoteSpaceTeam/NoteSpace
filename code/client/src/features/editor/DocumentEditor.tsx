import React, { useEffect, useState } from 'react';
import './DocumentEditor.scss';
import useKeyHandlers from './hooks/useKeyHandlers.ts';
import useWaypointFugue from '../conflict/hooks/useWaypointFugue.ts';
import useSocketListeners from '../collab/useSocketListeners.ts';
import { getTagValue } from '../conflict/utils.ts';
import { getCursorPosition } from './components/CursorsManager/utils.ts';
import CursorsManager from './components/CursorsManager/CursorsManager.tsx';
import TextArea from '../../shared/components/TextArea/TextArea.tsx';


export default function DocumentEditor() {
  const [text, setText] = useState('');
  const [operationBuffer, setOperationBuffer] = useState<OperationData[]>([]);
  const { elements, setElements, operations, sortTree } = useWaypointFugue();
  const { onKeyDown, onKeyUp } = useKeyHandlers(operations);

  const socket = useSocketListeners({
    operation: onOperation,
    document: onDocument,
  });

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
        <TextArea
          value={text}
          onKeyDown={(e: { key: string; }) => onKeyDown(e.key)}
          onKeyUp={(e: { key: string; }) => onKeyUp(e.key)}
          onMouseUp={handleCursorPositionChange}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setText(e.target.value)}
          placeholder={'Start writing...'}
        />
        <CursorsManager/>
      </div>
    </div>
  );
}
