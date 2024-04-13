import { getClipboardEvent, getKeyFromInputEvent } from '@editor/slate/utils/domEvents';
import { getSelection, isSelected } from '@editor/slate/utils/selection';
import { isEqual } from 'lodash';
import { nodeInsert } from '@editor/crdt/utils';
import { Cursor, emptyCursor } from '@notespace/shared/types/cursor';
import CustomEditor from '@editor/slate/CustomEditor';
import { InlineStyle } from '@notespace/shared/types/styles';
import { Editor } from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import { Selection } from '@notespace/shared/types/cursor';
import { Communication } from '@socket/communication';

export default (editor: Editor, fugue: Fugue, communication: Communication) => {
  function onInput(e: InputEvent) {
    const key = getKeyFromInputEvent(e);
    if (!key) return;

    // support for mobile paste events
    if (key === 'Paste') {
      const pasteEvent = getClipboardEvent(e);
      onPaste(pasteEvent);
      return;
    }
    const keyboardEvent = new KeyboardEvent('keydown', { key });
    onKeyPressed(keyboardEvent);
  }

  /**
   * Handles key press events
   * @param e
   */
  function onKeyPressed(e: KeyboardEvent) {
    const selection = getSelection(editor);
    // if there is a selection, delete the selected text
    if (isSelected(editor)) onDeleteSelection(selection);

    switch (e.key) {
      case 'Enter':
        onEnter(selection.start);
        break;
      case 'Backspace':
        onBackspace(selection.start);
        break;
      case 'Delete':
        onDelete(selection.start);
        break;
      default:
        if (e.key.length !== 1) break;
        onKey(e.key, selection);
        break;
    }
  }

  function onDeleteSelection(selection: Selection) {
    const operations = fugue.deleteLocal(selection);
    communication.emitChunked('operation', operations);
  }

  /**
   * Inserts text at the current cursor position
   * @param key
   * @param selection
   */
  function onKey(key: string, selection: Selection) {
    const styles = CustomEditor.getMarks(editor) as InlineStyle[];
    const operations = fugue.insertLocal(selection.start, nodeInsert(key, styles));
    communication.emitChunked('operation', operations);
  }

  /**
   * Handles enter key press
   * @param cursor
   */
  function onEnter(cursor: Cursor) {
    const operations = fugue.insertLocal(cursor, '\n');
    const styleOperation = fugue.updateBlockStyleLocal('paragraph', cursor.line, true);
    communication.emitChunked('operation', [...operations, styleOperation]);
  }

  /**
   * Handles backspace key press
   * Deletes the character before the cursor
   */
  function onBackspace(cursor: Cursor) {
    if (isEqual(cursor, emptyCursor())) return;
    const operations = fugue.deleteLocalByCursor(cursor);
    if (operations) communication.emit('operation', operations);
  }

  /**
   * Handles delete key press
   * Deletes the character after the cursor
   */
  function onDelete({ line, column }: Cursor) {
    const cursor = { line, column: column + 1 };
    const operations = fugue.deleteLocalByCursor(cursor);
    if (operations) communication.emit('operation', operations);
  }

  /**
   * Handles paste events
   */
  function onPaste(e: ClipboardEvent) {
    const clipboardData = e.clipboardData?.getData('text');
    if (!clipboardData) return;
    const { start } = getSelection(editor);
    const nodes = clipboardData.split('');
    const operations = fugue.insertLocal(start, ...nodes);
    communication.emitChunked('operation', operations);
  }

  /**
   * Handles cut events
   */
  function onCut() {
    const selection = getSelection(editor);
    const operations = fugue.deleteLocal(selection);
    communication.emitChunked('operation', operations);
  }

  /**
   * Handles cursor selection
   */
  function onSelect() {
    const range = editor.selection;
    communication.emit('cursorChange', range);
  }

  return { onInput, onPaste, onCut, onSelect };
};
