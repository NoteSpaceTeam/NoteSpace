import { Fugue } from '@editor/crdt/fugue';
import CustomEditor from '@editor/slate/CustomEditor';
import { type Editor, Range } from 'slate';
import { getSelection } from '../utils/selection';
import { isEqual } from 'lodash';
import { insertNode } from '@src/editor/crdt/utils';
import { Cursor, emptyCursor, Selection } from '@notespace/shared/types/cursor';
import { socket } from '@src/socket/socket';
import { BlockStyle, InlineStyle } from '@notespace/shared/types/styles';
import { isMultiBlock } from '@editor/slate/utils/slate';
import { getClipboardEvent, getKeyFromInputEvent } from '@editor/slate/utils/domEvents';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
};

function useInputHandlers(editor: Editor) {
  const fugue: Fugue = Fugue.getInstance();

  // support for mobile browsers
  function onInput(e: InputEvent) {
    const key = getKeyFromInputEvent(e);
    if (!key) return;
    if (key === 'Paste') {
      const pasteEvent = getClipboardEvent(e);
      onPaste(pasteEvent);
      return;
    }
    const keyboardEvent = new KeyboardEvent('keydown', { key });
    onKeyPressed(keyboardEvent);
  }

  function onKeyPressed(e: KeyboardEvent) {
    const selection = getSelection(editor);
    console.log('key pressed', e.key);
    if (e.key !== 'Backspace') {
      // when typing with a selection, delete the selection first
      if (selection.start.column !== selection.end.column) onBackspace();
    }
    switch (e.key) {
      case 'Enter':
        onEnter(selection.start);
        break;
      case 'Backspace':
        onBackspace();
        break;
      case 'Tab':
        e.preventDefault();
        onTab(selection.start);
        break;
      default:
        if (e.key.length !== 1) break;
        onInsertText(e.key, selection);
        break;
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey) {
      shortcutHandler(e);
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      onTab(getSelection(editor).start);
    }
  }

  function shortcutHandler(event: KeyboardEvent) {
    switch (event.key) {
      case 'z':
        onUndo();
        break;
      case 'y':
        onRedo();
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

  function onInsertText(key: string, selection: Selection) {
    const styles = CustomEditor.getMarks(editor) as InlineStyle[];
    fugue.insertLocal(selection.start, insertNode(key, styles));
  }

  function onEnter(cursor: Cursor) {
    fugue.insertLocal(cursor, insertNode('\n', []));
    const type = editor.children[cursor.line].type as BlockStyle;
    if (isMultiBlock(type)) {
      fugue.updateBlockStyleLocal(type, cursor.line + 1);
    }
  }

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

  function onTab(cursor: Cursor) {
    editor.insertText('\t');
    fugue.insertLocal(cursor, insertNode('\t', []));
  }

  function onPaste(e: ClipboardEvent) {
    const clipboardData = e.clipboardData?.getData('text');
    if (!clipboardData) return;
    const { start } = getSelection(editor);
    const nodes = clipboardData.split('').map(char => insertNode(char, []));
    fugue.insertLocal(start, ...nodes);
  }

  function onCut() {
    const selection = getSelection(editor);
    fugue.deleteLocal(selection);
  }

  function onUndo() {
    // TODO: Implement undo (broadcast to other clients)
    const undoOperation = editor.history.undos.at(-1);
    socket.emit('historyOperation', { operation: undoOperation, type: 'undo' });
  }

  function onRedo() {
    // TODO: Implement redo (broadcast to other clients)
    const redoOperation = editor.history.redos.at(-1);
    socket.emit('historyOperation', { operation: redoOperation, type: 'redo' });
  }

  function onCtrlBackspace() {
    const { start } = getSelection(editor);
    fugue.deleteWordLocal(start, true);
  }

  function onCtrlDelete() {
    const { start } = getSelection(editor);
    fugue.deleteWordLocal(start, false);
  }

  function onFormat(key: string) {
    const mark = hotkeys[key];
    if (!mark) return;
    CustomEditor.toggleMark(editor, mark);
  }

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
