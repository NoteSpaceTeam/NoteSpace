import { getKeyFromInputEvent } from '@editor/slate/utils/domEvents';
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
import { Operation } from '@notespace/shared/crdt/types/operations';

export default (editor: Editor, fugue: Fugue, communication: Communication) => {
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

  function onDeleteSelection(selection: Selection) {
    const operations = fugue.deleteLocal(selection);
    communication.emitChunked('operation', operations);
  }

  /**
   * Inserts text at the current cursor position
   * @param key
   * @param cursor
   */
  function onKey(key: string, cursor: Cursor) {
    const styles = CustomEditor.getMarks(editor) as InlineStyle[];
    const operations = fugue.insertLocal(cursor, nodeInsert(key, styles));
    communication.emitChunked('operation', operations);
  }

  /**
   * Handles enter key press
   * @param cursor
   */
  function onEnter(cursor: Cursor) {
    const operations = fugue.insertLocal(cursor, '\n');
    const styleOperation = fugue.updateBlockStyleLocal('paragraph', cursor.line, true);
    communication.emitChunked('operation', [styleOperation, ...operations]);
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
  function onPaste(clipboard: ClipboardEvent | string) {
    const clipboardData = typeof clipboard === 'string' ? clipboard : clipboard.clipboardData?.getData('text');
    if (!clipboardData) return;
    const { start } = getSelection(editor);
    const chars = clipboardData.split('');
    const lineNodes = chars.filter(char => char === '\n');
    const operations: Operation[] = fugue.insertLocal(start, ...chars);
    for (let i = 0; i < lineNodes.length; i++) {
      const styleOperation = fugue.updateBlockStyleLocal('paragraph', start.line + i, true);
      operations.push(styleOperation);
    }
    communication.emitChunked('operation', operations);
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
    const operations = fugue.insertLocal(cursor, tab);
    communication.emit('operation', operations);
  }

  /**
   * Handles cursor selection
   */
  function onSelect() {
    // let the selection update first
    setTimeout(() => {
      const range = editor.selection;
      communication.emit('cursorChange', range);
    }, 10);
  }

  return { onInput, onPaste, onCut, onSelect };
};
