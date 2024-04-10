import { Fugue } from '@src/editor/crdt/fugue';
import { Editor } from 'slate';
import CustomEditor from '@editor/slate/CustomEditor';
import { getSelection } from '../utils/selection';
import { isEqual } from 'lodash';
import { nodeInsert } from '@src/editor/crdt/utils';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { Cursor, emptyCursor } from '@notespace/shared/types/cursor';
import { isMultiBlock } from '../utils/slate';
import { Selection } from '@notespace/shared/types/cursor';
import { getClipboardEvent, getKeyFromInputEvent } from '../utils/domEvents';

export type KeyEvents = ReturnType<typeof keyEvents>;

function keyEvents(editor: Editor, fugue: Fugue) {
  /**
   * Inserts text at the current cursor position
   * @param key
   * @param selection
   */
  function onKey(key: string, selection: Selection) {
    const styles = CustomEditor.getMarks(editor) as InlineStyle[];
    fugue.insertLocal(selection.start, nodeInsert(key, styles));
  }

  /**
   * Handles input events
   * @param e
   */
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
    if (!isEqual(selection.start, selection.end)) onBackspace(selection);
    switch (e.key) {
      case 'Enter':
        onEnter(selection.start);
        break;
      case 'Backspace':
        onBackspace(selection);
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
  function onBackspace(selection: Selection) {
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

  /**
   * Handles delete key press
   */
  function onDelete(cursor: Cursor) {
    // delete to the right of cursor
    const deleteCursor = {
      line: cursor.line,
      column: cursor.column + 1,
    };
    const node = fugue.getNodeByCursor(deleteCursor);
    if (node) fugue.deleteLocalById(node.id);
  }

  /**
   * Handles tab key press
   */
  function onTab() {
    const cursor = getSelection(editor).start;
    editor.insertText('\t');
    fugue.insertLocal(cursor, '\t');
  }

  return {
    onKey,
    onEnter,
    onBackspace,
    onDelete,
    onTab,
  };
}

export default keyEvents;
