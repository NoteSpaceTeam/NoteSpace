import type React from 'react';
import { type Fugue } from '@editor/crdt/fugue';
import CustomEditor from '@editor/slate.js/model/CustomEditor';
import { type Editor } from 'slate';
import { getSelection } from '../utils/selection';
import { isEqual } from 'lodash';
import { insertNode } from '@src/editor/crdt/utils';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
  c: 'code',
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
      default:
        if (e.key.length !== 1) break;
        fugue.insertLocal(start, insertNode(e.key, []));
        break;
    }
  }

  function onPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const clipboardData = e.clipboardData?.getData('text');
    if (!clipboardData) return;
    const selection = getSelection(editor);
    const { start } = selection;
    fugue.insertLocal(start, insertNode(clipboardData, [])); // TODO: Fix this
  }

  function onCut() {
    const selection = getSelection(editor);
    fugue.deleteLocal(selection); // TODO: Fix this
  }

  function shortcutHandler(event: React.KeyboardEvent<HTMLDivElement>) {
    const mark = hotkeys[event.key];
    CustomEditor.toggleMark(editor, mark, fugue);
  }

  return { onKeyDown, onPaste, onCut };
}

export default useInputHandlers;
