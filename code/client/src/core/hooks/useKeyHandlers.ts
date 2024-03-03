import { socket } from '../../socket/socket.ts';
import { getCursorPosition } from '../utils.ts';

type useKeyHandlers = {
  insertLocal: (character: string, cursor: number) => string;
  deleteLocal: (cursor: number) => string;
  insertRemote: (character: string) => void;
  deleteRemote: (character: string) => void;
};

function useKeyHandlers(operations: useKeyHandlers) {
  function onKeyDown(key: string) {
    const textarea = document.querySelector('textarea')!;
    const cursor = textarea.selectionStart;
    const position = getCursorPosition(textarea);

    function onBackspace() {
      const character = operations.deleteLocal(cursor);
      if (character === '') return;
      socket.emit('operation', { type: 'delete', character });
      socket.emit('cursorChange', { line: position.line, column: position.column - 1 });
    }

    function onEnter() {
      const character = operations.insertLocal('\n', cursor);
      socket.emit('operation', { type: 'insert', character });
      socket.emit('cursorChange', { line: position.line + 1, column: 1 });
    }

    function onDefault(key: string) {
      const character = operations.insertLocal(key, cursor);
      socket.emit('operation', { type: 'insert', character });
      socket.emit('cursorChange', { line: position.line, column: position.column + 1 });
    }
    switch (key) {
      case 'Backspace': {
        onBackspace();
        break;
      }
      case 'Enter': {
        onEnter();
        break;
      }
      default: {
        if (key.length === 1) {
          onDefault(key);
          break;
        }
      }
    }
  }

  function onKeyUp(key: string) {
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (arrowKeys.includes(key)) {
      const textarea = document.querySelector('textarea')!;
      const position = getCursorPosition(textarea);
      socket.emit('cursorChange', position);
    }
  }

  return { onKeyDown, onKeyUp };
}

export default useKeyHandlers;
