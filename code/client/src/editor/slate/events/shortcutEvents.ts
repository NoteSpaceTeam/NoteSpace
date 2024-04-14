import { getSelection } from '@editor/slate/utils/selection';
import { Editor } from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import CustomEditor from '@editor/slate/CustomEditor';
import { HistoryOperations } from '@editor/slate/events/historyEvents';
import { Communication } from '@socket/communication';
import { Cursor } from '@notespace/shared/types/cursor';
import { formatMark } from '@editor/slate/utils/formatMark';
import { InlineStyle } from '@notespace/shared/types/styles';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
};

export default (editor: Editor, fugue: Fugue, communication: Communication, history: HistoryOperations) => {
  /**
   * Handles keyboard shortcuts
   * @param event
   */
  function onShortcut(event: KeyboardEvent) {
    if (!event.ctrlKey) return;
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
    const operations = fugue.deleteWordByCursor(cursor, true);
    if (!operations) return;
    communication.emit('operation', operations);
  }

  /**
   * Handles ctrl + delete
   */
  function onCtrlDelete(cursor: Cursor) {
    const operations = fugue.deleteWordByCursor(cursor, false);
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
    const value = CustomEditor.toggleMark(editor, mark);
    const operations = formatMark(fugue, editor, mark as InlineStyle, value);
    communication.emitChunked('operation', operations);
  }

  return { onShortcut };
};
