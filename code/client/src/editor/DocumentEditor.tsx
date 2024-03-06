import { useEffect, useState } from 'react';
import useKeyHandlers from './hooks/useKeyHandlers.ts';
import useSocketListeners from '../socket/useSocketListeners.ts';
import { getCursorPosition } from './components/CursorsManager/utils.ts';
import CursorsManager from './components/CursorsManager/CursorsManager.tsx';
import TextArea from '../shared/components/TextArea/TextArea.tsx';
import {socket} from "../socket/socket.ts";
import useOperationBuffer from "./hooks/useOperationBuffer.ts";
import useOptimizedFugue from "./crdt/useOptimizedFugue.ts";
import './DocumentEditor.scss';

export default function DocumentEditor() {
  const [text, setText] = useState('');
  const { tree, setTree, getState, operations } = useOptimizedFugue();
  const { setOperationBuffer } = useOperationBuffer(operations);
  const { onKeyDown, onKeyUp } = useKeyHandlers(operations);

  function onOperation(operation: OperationData) {
    setOperationBuffer(prev => [...prev, operation]);
  }

  function onDocument(content: string[]) {
    setTree(prev => {
      return [...new Set([...prev, ...content])];
    });
  }

  function onCursorMove(textarea: HTMLTextAreaElement) {
    const position = getCursorPosition(textarea);
    socket.emit('cursorChange', position);
  }

  useSocketListeners({
    operation: onOperation,
    document: onDocument,
  });

  useEffect(() => {
    const state = getState();
    setText(state);
  }, [getState, tree]);

  return (
    <div className="editor">
      <header>
        <span className="fa fa-bars"></span>
        <h1>NoteSpace</h1>
      </header>
      <div className="container">
        <TextArea
          value={text}
          onKeyDown={e => onKeyDown(e.key)}
          onKeyUp={e => onKeyUp(e.key)}
          onMouseUp={e => onCursorMove(e.currentTarget)}
          onChange={e => setText(e.target.value)}
          placeholder={'Start writing...'}
        />
        <CursorsManager />
      </div>
    </div>
  );
}
