import { getSelection } from '@editor/slate/utils/selection';
import { Editor } from 'slate';
import { Fugue } from '@editor/crdt/Fugue';
import CustomEditor from '@editor/slate/CustomEditor';
import { HistoryOperations } from '@editor/slate/events/historyEvents';
import { Communication } from '@socket/communication';
import { Cursor } from '@notespace/shared/types/cursor';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
};

export default (editor: Editor, fugue: Fugue, communication: Communication, history: HistoryOperations) => {
  /**
   * Handles key down events
   * @param e
   */
  function onKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey) shortcutHandler(e);
    if (e.key === 'Tab') {
      e.preventDefault();
      const { start: cursor } = getSelection(editor);
      onTab(cursor);
    }
  }

  /**
   * Handles keyboard shortcuts
   * @param event
   */
  function shortcutHandler(event: KeyboardEvent) {
    const { start: cursor } = getSelection(editor);
    switch (event.key) {
      case 'z':
        history.undo();
        break;
      case 'y':
        history.redo();
        break;
      case 'Backspace':
        onCtrlBackspace(cursor);
        break;
      case 'Delete':
        onCtrlDelete(cursor);
        break;
      default:
        onFormat(event.key);
    }
  }

  /**
   * Handles ctrl + backspace
   */
  function onCtrlBackspace(cursor: Cursor) {
    const operations = fugue.deleteWordLocal(cursor, true);
    if (!operations) return;
    communication.emit('operation', operations);
  }

  /**
   * Handles ctrl + delete
   */
  function onCtrlDelete(cursor: Cursor) {
    const operations = fugue.deleteWordLocal(cursor, false);
    if (!operations) return;
    communication.emit('operation', operations);
  }

  /**
   * Handles formatting
   * @param key
   */
  function onFormat(key: string) {
    const mark = hotkeys[key];
    if (!mark) return;
    const operations = CustomEditor.toggleMark(editor, mark, fugue);
    communication.emitChunked('operation', operations);
  }

  /**
   * Handles tab key press
   */
  function onTab(cursor: Cursor) {
    const tab = '\t';
    editor.insertText(tab);
    const operations = fugue.insertLocal(cursor, tab);
    communication.emit('operation', operations);
  }

  return { onKeyDown };
};
