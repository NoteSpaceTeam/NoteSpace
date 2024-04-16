import { getSelection } from '@editor/slate/utils/selection';
import { Editor } from 'slate';
import CustomEditor from '@editor/slate/CustomEditor';
import { HistoryOperations } from '@editor/slate/events/historyEvents';
import { Cursor } from '@notespace/shared/types/cursor';
import { ShortcutHandlers } from '@editor/domain/events/shortcut/types';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
};

export default (editor: Editor, handlers : ShortcutHandlers, history: HistoryOperations) => {
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
  const onCtrlBackspace = (cursor: Cursor) => handlers.onCtrlDeletion(cursor, true);

  /**
   * Handles ctrl + delete
   */
  const onCtrlDelete = (cursor: Cursor) => handlers.onCtrlDeletion(cursor, false);

  /**
   * Handles formatting
   * @param key
   */
  function onFormat(key: string) {
    const mark = hotkeys[key];
    if (!mark) return;
    const value = CustomEditor.toggleMark(editor, mark);
    handlers.onFormat(mark, value);
  }

  return { onShortcut };
};
