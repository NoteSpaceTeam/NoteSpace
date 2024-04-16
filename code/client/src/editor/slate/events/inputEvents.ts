import { getKeyFromInputEvent } from '@editor/slate/utils/domEvents';
import { getSelection, isSelected } from '@editor/slate/utils/selection';
import { isEqual } from 'lodash';
import { Cursor, emptyCursor } from '@notespace/shared/types/cursor';
import CustomEditor from '@editor/slate/CustomEditor';
import { InlineStyle } from '@notespace/shared/types/styles';
import { Editor } from 'slate';
import { Selection } from '@notespace/shared/types/cursor';
import { InputHandlers } from '@editor/domain/events/input/types';

export default (editor: Editor, handlers : InputHandlers) => {
  function onInput(e: InputEvent) {
    const key = getKeyFromInputEvent(e);
    if (!key) return;

    const selection = getSelection(editor);
    const cursor = selection.start;
    // if there is a selection, delete the selected text
    if (isSelected(editor)) onDeleteSelection(selection);

    switch (key) {
      case 'Enter':
        onEnter(cursor);
        break;
      case 'Backspace':
        if (isSelected(editor)) break;
        onBackspace(cursor);
        break;
      case 'Delete':
        onDelete(cursor);
        break;
      case 'Paste':
        onPaste(e.data || '');
        break;
      case 'Tab':
        e.preventDefault();
        onTab(cursor);
        break;
      default:
        if (key.length !== 1) break;
        onKey(key, cursor);
        break;
    }
  }

  const onDeleteSelection = (selection: Selection) => handlers.onDeleteSelection(selection);

  /**
   * Inserts text at the current cursor position
   * @param key
   * @param cursor
   */
  function onKey(key: string, cursor: Cursor) {
    const styles = CustomEditor.getMarks(editor) as InlineStyle[];
    handlers.onKey(key, cursor, styles);
  }

  /**
   * Handles enter key press
   * @param cursor
   */
  const onEnter = (cursor: Cursor) => handlers.onEnter(cursor);


  /**
   * Handles backspace key press
   * Deletes the character before the cursor
   */
  function onBackspace(cursor: Cursor) {
    if (isEqual(cursor, emptyCursor())) return;
    handlers.onBackspace(cursor);
  }

  /**
   * Handles delete key press
   * Deletes the character after the cursor
   */
  function onDelete({ line, column }: Cursor) {
    const cursor = { line, column: column + 1 };
    handlers.onDelete(cursor);
  }

  /**
   * Handles paste events
   */
  function onPaste(clipboard: ClipboardEvent | string) {
    const clipboardData = typeof clipboard === 'string' ? clipboard : clipboard.clipboardData?.getData('text');
    if (!clipboardData) return;
    const { start } = getSelection(editor);
    const chars = clipboardData.split('');
    const lineNodes = chars.filter(char => char === '\n');
    handlers.onPaste(start, chars, lineNodes);
  }

  function onCut() {
    const selection = getSelection(editor);
    onDeleteSelection(selection);
  }

  /**
   * Handles tab key press
   */
  function onTab(cursor: Cursor) {
    const tab = '\t';
    editor.insertText(tab);
    handlers.onTab(cursor, tab);
  }

  /**
   * Handles cursor selection
   */
  function onSelect() {
    // let the selection update first
    setTimeout(() => {
      const range = editor.selection;
      if (!range) return;
      handlers.onSelection(range);
    }, 10);
  }

  return { onInput, onPaste, onCut, onSelect };
};
