import { getCursorPosition } from '../components/CursorsManager/utils.ts';
import { socket } from '../../socket/socket.ts';
import { Fugue } from '../crdt/fugue.ts';

function useKeyHandlers(fugue: Fugue<unknown>) {
  function onKeyDown(key: string) {
    const textarea = document.querySelector('textarea')!;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const position = getCursorPosition(textarea);
    console.log('key', key);
    function onBackspace() {
      console.log('selectionStart', selectionStart);
      console.log('selectionEnd', selectionEnd);
      if (selectionStart === 0 && selectionEnd == 0) return;
      console.log('backspace');
      fugue.deleteLocal(selectionStart, selectionEnd);
      socket.emit('cursorChange', { line: position.line, column: position.column - 1 });
    }

    function onEnter() {
      fugue.insertLocal(selectionStart, '\n');
      socket.emit('cursorChange', { line: position.line + 1, column: 1 });
    }

    function onDefault(key: string) {
      fugue.insertLocal(selectionStart, key);
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
