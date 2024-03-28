import type React from 'react';
import { type Fugue } from '@editor/crdt/fugue';
import CustomEditor from '@editor/slate/model/CustomEditor';
import { type Editor } from 'slate';
import { getSelection } from '../utils/selection';
import { isEqual } from 'lodash';
import { insertNode } from '@src/editor/crdt/utils';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
};

function useInputHandlers(editor: Editor, fugue: Fugue) {
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey) return shortcutHandler(e);

    const selection = getSelection(editor);
    const { start, end } = selection;
    switch (e.key) {
      case 'Enter':
        fugue.insertLocal(start, insertNode('\n', []));
        break;
      case 'Backspace': {
        const startPosition = { line: 0, column: 0 };
        if (isEqual(startPosition, start) && isEqual(startPosition, end)) break;
        fugue.deleteLocal(selection);
        break;
      }
      case 'Tab':
        e.preventDefault();
        editor.insertText('\t');
        fugue.insertLocal(start, insertNode('\t', []));
        break;
      default: {
        if (e.key.length !== 1) break;
        if (selection.start.column !== selection.end.column) {
          fugue.deleteLocal(selection); // replace selection
        }
        const previousNode = fugue.getNodeByCursor(start);
        const styles = previousNode?.styles || [];
        fugue.insertLocal(start, insertNode(e.key, styles));
        break;
      }
    }
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
    const selection = getSelection(editor); // problem here
    fugue.deleteLocal(selection); // TODO: Fix this
  }

  function onUndo() {
    // TODO: Implement undo
  }

  function onRedo() {
    // TODO: Implement redo
  }

  function shortcutHandler(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'z':
        onUndo();
        break;
      case 'y':
        onRedo();
        break;
      default: {
        const mark = hotkeys[event.key];
        CustomEditor.toggleMark(editor, mark, fugue);
      }
    }
  }
  return { onKeyDown, onPaste, onCut };
}

export default useInputHandlers;
