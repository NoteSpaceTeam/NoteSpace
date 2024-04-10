import { getSelection } from '@editor/slate/utils/selection';
import { Editor } from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import CustomEditor from '@editor/slate/CustomEditor';
import { HistoryOperations } from '@editor/slate/hooks/historyEvents';

export default (editor: Editor, fugue: Fugue, { undo, redo }: HistoryOperations) => {
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
    fugue.insertLocal(cursor, '\t');
  }

  /**
   * Handles ctrl + backspace
   */
  function onCtrlBackspace() {
    const { start } = getSelection(editor);
    fugue.deleteWordLocal(start, true);
  }

  /**
   * Handles ctrl + delete
   */
  function onCtrlDelete() {
    const { start } = getSelection(editor);
    fugue.deleteWordLocal(start, false);
  }

  /**
   * Handles formatting
   * @param key
   */
  function onFormat(key: string) {
    const mark = hotkeys[key];
    if (!mark) return;
    CustomEditor.toggleMark(editor, mark, fugue);
  }

  return { onKeyDown };
};
