import { getSelection } from '@editor/slate/utils/selection';
import { Editor } from 'slate';
import { Fugue } from '@editor/crdt/Fugue';
import CustomEditor from '@editor/slate/CustomEditor';
import { HistoryOperations } from '@editor/slate/events/historyEvents';
import { Socket } from 'socket.io-client';


export default (
  editor: Editor,
  fugue: Fugue,
  socket : Socket,
  { undo, redo }: HistoryOperations
) => {
  const hotkeys: Record<string, string> = {
    b: 'bold',
    i: 'italic',
    u: 'underline',
  };

  /**
   * Handles key down events
   * @param e
   */
  function onKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey) shortcutHandler(e);
    if (e.key === 'Tab') {
      e.preventDefault();
      onTab();
    }
  }

  /**
   * Handles keyboard shortcuts
   * @param event
   */
  function shortcutHandler(event: KeyboardEvent) {
    switch (event.key) {
      case 'z':
        undo();
        break;
      case 'y':
        redo();
        break;
      case 'Backspace':
        onCtrlBackspace();
        break;
      case 'Delete':
        onCtrlDelete();
        break;
      default:
        onFormat(event.key);
    }
  }

  /**
   * Handles tab key press
   */
  function onTab() {
    const cursor = getSelection(editor).start;
    editor.insertText('\t');
    socket.emitChunked('operation', fugue.insertLocal(cursor, '\t'));
  }

  /**
   * Handles ctrl + backspace
   */
  function onCtrlBackspace() {
    const { start } = getSelection(editor);
    const data = fugue.deleteWordLocal(start, true);
    if(!data) return;
    socket.emitChunked('operation', data);
  }

  /**
   * Handles ctrl + delete
   */
  function onCtrlDelete() {
    const { start } = getSelection(editor);
    const data = fugue.deleteWordLocal(start, false);
    if(!data) return;
    socket.emitChunked('operation', data);
  }

  /**
   * Handles formatting
   * @param key
   */
  function onFormat(key: string) {
    const mark = hotkeys[key];
    if (!mark) return;
    CustomEditor.toggleMark(editor, socket, mark, fugue);
  }

  return { onKeyDown };
};
