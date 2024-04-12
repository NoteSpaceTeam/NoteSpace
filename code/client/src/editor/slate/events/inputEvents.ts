import { getClipboardEvent, getKeyFromInputEvent } from '@editor/slate/utils/domEvents';
import { getSelection } from '@editor/slate/utils/selection';
import { isEqual } from 'lodash';
import { nodeInsert } from '@editor/crdt/utils';
import { Cursor, emptyCursor } from '@notespace/shared/types/cursor';
import CustomEditor from '@editor/slate/CustomEditor';
import { InlineStyle } from '@notespace/shared/types/styles';
import { Editor, Range } from 'slate';
import { Fugue } from '@editor/crdt/Fugue';
import { Selection } from '@notespace/shared/types/cursor';
import { Communication } from '@socket/communication';
import { Operation } from '@notespace/shared/crdt/types/operations';

export default (editor: Editor, fugue: Fugue, communication: Communication) => {
  function onInput(e: InputEvent) {
    const key = getKeyFromInputEvent(e);
    if (!key) return;

    // Supports mobile paste events, such as autocorrect
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
    // if selection is not empty, delete the selected text
    if (!isEqual(selection.start, selection.end)) onDeleteSelection(selection);
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
    const { start, end } = selection;
    const startCursor = emptyCursor();
    if ([startCursor, start, end].every(isEqual)) return;
    const operations: Operation[] = fugue.deleteLocal(selection);

    // // reset block styles
    // if (start.column === 0 || start.line !== end.line) {
    //   const newSelection = start.line !== end.line ? { start: { line: start.line + 1, column: 0 }, end } : selection;
    //   const styleOperations = fugue.updateBlockStylesLocalBySelection('paragraph', newSelection);
    //   operations.push(...styleOperations);
    // }
    communication.emitChunked('operation', operations);
  }

  /**
   * Inserts text at the current cursor position
   * @param key
   * @param selection
   */
  function onKey(key: string, selection: Selection) {
    const styles = CustomEditor.getMarks(editor) as InlineStyle[];
    communication.emitChunked('operation', fugue.insertLocal(selection.start, nodeInsert(key, styles)));
  }

  /**
   * Handles enter key press
   * @param cursor
   */
  function onEnter(cursor: Cursor) {
    communication.emitChunked('operation', fugue.insertLocal(cursor, '\n'));
    //const type = editor.children[cursor.line].type as BlockStyle;
    //if (!isMultiBlock(type)) return;
    //communication.emitChunked('operation', [fugue.updateBlockStyleLocal(type, cursor.line + 1)]);
  }

  /**
   * Handles backspace key press
   * Deletes the character before the cursor
   */
  function onBackspace(cursor: Cursor) {
    // if cursor is at the beginning of the document, reset the block style
    const operations = fugue.deleteNodeByCursor(cursor);
    if (operations) communication.emit('operation', operations);
  }

  /**
   * Handles delete key press
   * Deletes the character after the cursor
   */
  function onDelete({ line, column }: Cursor) {
    const cursor = { line, column: column + 1 };
    const operations = fugue.deleteNodeByCursor(cursor);
    if (operations) communication.emit('operation', operations);
  }

  /**
   * Handles paste events
   */
  function onPaste(e: ClipboardEvent) {
    const clipboardData = e.clipboardData?.getData('text');
    if (!clipboardData) return;
    const { start } = getSelection(editor);
    const nodes = clipboardData.split('').map(char => nodeInsert(char, []));
    communication.emitChunked('operation', fugue.insertLocal(start, ...nodes));
  }

  /**
   * Handles cut events
   */
  function onCut() {
    const selection = getSelection(editor);
    communication.emitChunked('operation', fugue.deleteLocal(selection));
  }

  /**
   * Handles cursor selection
   */
  function onSelect() {
    // let the selection update before sending it
    const range: Range | null = editor.selection;
    communication.emit('cursorChange', range);
  }

  return { onInput, onPaste, onCut, onSelect };
};
