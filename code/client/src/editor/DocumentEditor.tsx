import { useState } from 'react';
import useKeyHandlers from './hooks/useKeyHandlers.ts';
import useSocketListeners from '../socket/useSocketListeners.ts';
import { getCursorPosition } from './components/CursorsManager/utils.ts';
import CursorsManager from './components/CursorsManager/CursorsManager.tsx';
import TextArea from '../shared/components/TextArea/TextArea.tsx';
import { socket } from '../socket/socket.ts';
import './DocumentEditor.scss';
import useFugueCRDT from './crdt/useFugueCRDT.tsx';
import { DeleteMessage, InsertMessage } from './crdt/types.ts';

function DocumentEditor() {
  const [text, setText] = useState('');
  const fugue = useFugueCRDT();
  const { onKeyDown, onKeyUp } = useKeyHandlers(fugue);

  function onOperation<T>(operation: InsertMessage<T> | DeleteMessage) {
    switch (operation.type) {
      case 'insert':
        fugue.insertRemote(operation);
        break;
      case 'delete':
        fugue.deleteRemote(operation);
        break;
      default:
        throw new Error('Invalid operation type');
    }
    setText(fugue.text());
  }

  function onDocument<T>({ root }: TreeData<T>) {
    fugue.setTree(root);
    setText(fugue.text());
  }

  function onCursorMove(textarea: HTMLTextAreaElement) {
    const position = getCursorPosition(textarea);
    socket.emit('cursorChange', position);
  }

  useSocketListeners({
    operation: onOperation,
    document: onDocument,
  });

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

export default DocumentEditor;
