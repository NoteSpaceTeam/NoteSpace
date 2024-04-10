import { Fugue } from '@editor/crdt/fugue';
import CustomEditor from '@editor/slate/CustomEditor';
import { type Editor, Range } from 'slate';
import { getSelection } from '../utils/selection';
import { isEqual } from 'lodash';
import { nodeInsert } from '@src/editor/crdt/utils';
import { Cursor, emptyCursor, Selection } from '@notespace/shared/types/cursor';
import { socket } from '@src/socket/socket';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { isMultiBlock } from '@editor/slate/utils/slate';
import { getClipboardEvent, getKeyFromInputEvent } from '@editor/slate/utils/domEvents';
import useHistory from '@editor/slate/hooks/useHistory';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
};

/**
 * Handles input events
 * @param editor
 * @returns
 */
function useInputHandlers(editor: Editor) {
  const fugue: Fugue = Fugue.getInstance();
  // adds undo and redo functionality
  const { undo, redo } = useHistory(editor);

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
    if (isMultiBlock(type))
      fugue.updateBlockStyleLocal(type, cursor.line + 1);
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
      const newSelection = start.line !== end.line
        ? { start: { line: start.line + 1, column: 0 }, end }
        : selection;
      fugue.updateBlockStylesLocalBySelection('paragraph', newSelection);
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
   * Handles paste events
   * @param e
   */
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
    CustomEditor.toggleMark(editor, mark);
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

  return { onInput, onKeyDown, onPaste, onCut, onSelect };
}

export default useInputHandlers;
