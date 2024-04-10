import { getClipboardEvent, getKeyFromInputEvent } from '@editor/slate/utils/domEvents';
import { getSelection } from '@editor/slate/utils/selection';
import { isEqual } from 'lodash';
import { nodeInsert } from '@editor/crdt/utils';
import { Cursor, emptyCursor } from '@notespace/shared/types/cursor';
import { isMultiBlock } from '@editor/slate/utils/slate';
import CustomEditor from '@editor/slate/CustomEditor';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { Editor, Range } from 'slate';
import { Fugue } from '@editor/crdt/fugue';
import {Selection} from '@notespace/shared/types/cursor';
import { socket } from '@socket/socket';

export default (editor : Editor, fugue : Fugue) => {

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
    if (e.key !== 'Backspace' && !isEqual(selection.start, selection.end)) onBackspace();
    switch (e.key) {
      case 'Enter':
        onEnter(selection.start);
        break;
      case 'Backspace':
        onBackspace();
        break;
      default:
        if (e.key.length !== 1) break;
        onInsertText(e.key, selection);
        break;
    }
  }

  /**
   * Inserts text at the current cursor position
   * @param key
   * @param selection
   */
  function onInsertText(key: string, selection: Selection) {
    const styles = CustomEditor.getMarks(editor) as InlineStyle[];
    fugue.insertLocal(selection.start, nodeInsert(key, styles));
  }

  /**
   * Handles enter key press
   * @param cursor
   */
  function onEnter(cursor: Cursor) {
    fugue.insertLocal(cursor, '\n');
    const type = editor.children[cursor.line].type as BlockStyle;
    if (isMultiBlock(type)) fugue.updateBlockStyleLocal(type, cursor.line + 1);
  }

  /**
   * Handles backspace key press
   */
  function onBackspace() {
    const selection = getSelection(editor);
    const { start, end } = selection;
    const startCursor = emptyCursor();
    if ([startCursor, start, end].every(isEqual)) return;
    fugue.deleteLocal(selection);

    // Reset block style - same line if only one line selected else only the last line
    if (start.column === 0 || start.line !== end.line) {
      const newSelection = start.line !== end.line ? { start: { line: start.line + 1, column: 0 }, end } : selection;
      fugue.updateBlockStylesLocalBySelection('paragraph', newSelection);
    }
  }

  function onPaste(e: ClipboardEvent) {
    const clipboardData = e.clipboardData?.getData('text');
    if (!clipboardData) return;
    const { start } = getSelection(editor);
    const nodes = clipboardData.split('').map(char => nodeInsert(char, []));
    fugue.insertLocal(start, ...nodes);
  }

  /**
   * Handles cut events
   */
  function onCut() {
    const selection = getSelection(editor);
    fugue.deleteLocal(selection);
  }

  /**
   * Handles cursor selection
   */
  function onSelect() {
    // let the selection update before sending it
    setTimeout(() => {
      const range: Range | null = editor.selection;
      socket.emit('cursorChange', range);
    }, 10);
  }

  return { onInput, onPaste, onCut, onSelect };
}