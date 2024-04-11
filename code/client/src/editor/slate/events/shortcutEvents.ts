import { getSelection } from '@editor/slate/utils/selection';
import { Editor } from 'slate';
import { Fugue } from '@editor/crdt/Fugue';
import CustomEditor from '@editor/slate/CustomEditor';
import { HistoryOperations } from '@editor/slate/events/historyEvents';
import { Communication } from '@socket/communication';

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
        history.undo();
        break;
      case 'y':
        history.redo();
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
    communication.emitChunked('operation', fugue.insertLocal(cursor, '\t'));
  }

  /**
   * Handles ctrl + backspace
   */
  function onCtrlBackspace() {
    const { start } = getSelection(editor);
    const data = fugue.deleteWordLocal(start, true);
    if (!data) return;
    communication.emitChunked('operation', data);
  }

  /**
   * Handles ctrl + delete
   */
  function onCtrlDelete() {
    const { start } = getSelection(editor);
    const data = fugue.deleteWordLocal(start, false);
    if (!data) return;
    communication.emitChunked('operation', data);
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

  return { onKeyDown };
};
