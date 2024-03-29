import type React from 'react';
import { type Fugue } from '@editor/crdt/fugue';
import CustomEditor from '@editor/slate/model/CustomEditor';
import { type Editor } from 'slate';
import { getSelection } from '../utils/selection';
import { isEqual } from 'lodash';
import { insertNode } from '@src/editor/crdt/utils';
import { Cursor, Selection } from '@notespace/shared/types/cursor';
import { socket } from '@src/socket/socket.ts';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
};

function useInputHandlers(editor: Editor, fugue: Fugue) {
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey) return shortcutHandler(e);
    const selection = getSelection(editor);
    switch (e.key) {
      case 'Enter':
        onEnter(selection.start);
        break;
      case 'Backspace': {
        onBackspace(selection);
        break;
      }
      case 'Tab':
        e.preventDefault();
        onTab(selection.start);
        break;
      default: {
        if (e.key.length !== 1) break;
        onKey(e.key, selection);
        break;
      }
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
      default: {
        onFormat(event.key);
      }
    }
  }

  function onKey(key: string, selection: Selection) {
    if (selection.start.column !== selection.end.column) {
      fugue.deleteLocal(selection); // replace selection
    }
    const previousNode = fugue.getNodeByCursor(selection.start);
    const styles = previousNode?.styles || [];
    fugue.insertLocal(selection.start, insertNode(key, styles));
  }

  function onEnter(cursor: Cursor) {
    fugue.insertLocal(cursor, insertNode('\n', []));
  }

  function onBackspace(selection: Selection) {
    const startPosition = { line: 0, column: 0 };
    if ([startPosition, selection.start, selection.end].every(isEqual)) {
      return; // beginning of document
    }
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
    for (const char of clipboardData.split('').reverse().join('')) {
      fugue.insertLocal(start, insertNode(char, []));
    }
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
    // TODO: Implement delete word to the left of the cursor (broadcast to other clients)
  }

  function onCtrlDelete() {
    // TODO: Implement delete word to the right of the cursor (broadcast to other clients)
  }

  function onFormat(key: string) {
    const mark = hotkeys[key];
    if (!mark) return;
    CustomEditor.toggleMark(editor, mark, fugue);
  }

  function onSelect() {
    const selection = getSelection(editor);
    socket.emit('cursorChange', selection);
  }

  return { onKeyDown, onPaste, onCut, onSelect };
}

export default useInputHandlers;
