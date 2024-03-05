import React, { useEffect, useState } from 'react';
import './DocumentEditor.scss';
import useKeyHandlers from './hooks/useKeyHandlers.ts';
import useSocketListeners from '../socket/useSocketListeners.ts';

import { getCursorPosition } from './components/CursorsManager/utils.ts';
import CursorsManager from './components/CursorsManager/CursorsManager.tsx';
import useOptimizedFugue from '../crdt/hooks/useOptimizedFugue.ts';
import TextArea from '../shared/components/TextArea/TextArea.tsx';

export default function DocumentEditor() {
  const [text, setText] = useState('');
  const [operationBuffer, setOperationBuffer] = useState<OperationData[]>([]);
  // const { elements, setElements, operations, sortTree } = useWaypointFugue();
  const { tree, setTree, getState, operations } = useOptimizedFugue();

  const socket = useSocketListeners({
    operation: onOperation,
    document: onDocument,
  });

  const { onKeyDown, onKeyUp } = useKeyHandlers(socket, operations);

  useEffect(() => {
    function operationHandler({ type, data }: OperationData) {
      switch (type) {
        case 'insert': {
          operations.insertRemote(data);
          break;
        }
        case 'delete': {
          operations.deleteRemote(data);
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
    setTree(prev => {
      return [...new Set([...prev, ...content])];
    });
  }

  useEffect(() => {
    const txt = getState();
    console.log(txt);
    setText(txt);
  }, [getState, tree]);

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
          onKeyDown={(e: { key: string }) => onKeyDown(e.key)}
          onKeyUp={(e: { key: string }) => onKeyUp(e.key)}
          onMouseUp={handleCursorPositionChange}
          onChange={(e: { target: { value: React.SetStateAction<string> } }) => setText(e.target.value)}
          placeholder={'Start writing...'}
        />
        <CursorsManager />
      </div>
    </div>
  );
}
