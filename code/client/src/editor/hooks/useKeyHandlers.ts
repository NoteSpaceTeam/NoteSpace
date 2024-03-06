import { getCursorPosition } from '../components/CursorsManager/utils.ts';
import {socket} from "../../socket/socket.ts";

type useKeyHandlers = {
  insertLocal: (data: string, start: number, end: number) => string[];
  deleteLocal: (start: number, end: number) => (string | undefined)[];
  insertRemote: (data: string[]) => void;
  deleteRemote: (data: string[]) => void;
};

function useKeyHandlers(operations: useKeyHandlers) {
  function onKeyDown(key: string) {
    const textarea = document.querySelector('textarea')!;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const position = getCursorPosition(textarea);

    function onBackspace() {
      const data = operations.deleteLocal(selectionStart, selectionEnd);
      if (!data) return;
      socket.emit('operation', { type: 'delete', data });
      socket.emit('cursorChange', { line: position.line, column: position.column - 1 });
    }

    function onEnter() {
      const data = operations.insertLocal('\n', selectionStart, selectionEnd);
      socket.emit('operation', { type: 'insert', data });
      socket.emit('cursorChange', { line: position.line + 1, column: 1 });
    }

    function onDefault(key: string) {
      const data = operations.insertLocal(key, selectionStart, selectionEnd);
      socket.emit('operation', { type: 'insert', data });
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
