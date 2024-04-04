import type React from 'react';
import { Fugue } from '@editor/crdt/fugue';
import CustomEditor from '@editor/slate/model/CustomEditor';
import { type Editor } from 'slate';
import { getSelection } from '../utils/selection';
import { isEqual } from 'lodash';
import { insertNode } from '@src/editor/crdt/utils';
import { Cursor, emptyCursor, Selection } from '@notespace/shared/types/cursor';
import { socket } from '@src/socket/socket.ts';
import { InlineStyle } from '@notespace/shared/types/styles.ts';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
};

function useInputHandlers(editor: Editor) {
  const fugue: Fugue = Fugue.getInstance();

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey) return shortcutHandler(e);
    const selection = getSelection(editor);
    switch (e.key) {
      case 'Enter':
        onEnter(selection.start);
        break;
      case 'Backspace': {
        onBackspace();
        break;
      }
      case 'Tab':
        e.preventDefault();
        onTab(selection.start);
        break;
      default:
        if (e.key.length !== 1) break;
        onKeyPressed(e.key, selection);
        break;
    }
  }

  function shortcutHandler(event: React.KeyboardEvent<HTMLDivElement>) {
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

  function onKeyPressed(key: string, selection: Selection) {
    if (selection.start.column !== selection.end.column) fugue.deleteLocal(selection);
    const styles = CustomEditor.getMarks(editor) as InlineStyle[];
    fugue.insertLocal(selection.start, insertNode(key, styles));
  }

  function onEnter(cursor: Cursor) {
    fugue.insertLocal(cursor, insertNode('\n', []));
  }

  function onBackspace() {
    const selection = getSelection(editor);
    const startCursor = emptyCursor();
    if ([startCursor, selection.start, selection.end].every(isEqual)) return;
    fugue.deleteLocal(selection);
  }

  function onTab(cursor: Cursor) {
    editor.insertText('\t');
    fugue.insertLocal(cursor, insertNode('\t', []));
  }

  function onPaste(e: React.ClipboardEvent<HTMLDivElement>) {
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
  }

  function onRedo() {
    // TODO: Implement redo (broadcast to other clients)
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
      const selection = getSelection(editor);
      socket.emit('cursorChange', selection);
    }, 10);
  }

  return { onKeyDown, onPaste, onCut, onSelect };
}

export default useInputHandlers;
