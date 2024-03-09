import { useState } from 'react';
import useKeyHandlers from './hooks/useKeyHandlers.ts';
import useSocketListeners from '../socket/useSocketListeners.ts';
import { getCursorPosition } from './components/CursorsManager/utils.ts';
import CursorsManager from './components/CursorsManager/CursorsManager.tsx';
import TextArea from '../shared/components/TextArea/TextArea.tsx';
import { socket } from '../socket/socket.ts';
import './DocumentEditor.scss';
import useFugueCRDT from './crdt/useFugueCRDT.tsx';
import { DeleteMessage, InsertMessage, Node } from './crdt/types.ts';

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

  function onDocument<T>({ root, nodes }: TreeData<T>) {
    const nodesMap = new Map<string, Node<T>[]>(Object.entries(nodes));
    fugue.setTree(root, nodesMap);
    setText(fugue.text());
  }

  function onCursorMove(textarea: HTMLTextAreaElement) {
    const position = getCursorPosition(textarea);
    socket.emit('cursorChange', position);
  }

  function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const position = getCursorPosition(e.currentTarget);
    fugue.insertLocal(position.column, text);
    setText(fugue.text());
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
          onPaste={onPaste}
          placeholder={'Start writing...'}
        />
        <CursorsManager />
      </div>
    </div>
  );
}

export default DocumentEditor;
