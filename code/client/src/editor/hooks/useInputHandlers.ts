import type React from 'react';
import { type Fugue } from '../crdt/fugue.ts';
import CustomEditor from '@editor/slate/model/CustomEditor.ts';
import { type Editor } from 'slate';
import { insertNode } from '@editor/crdt/utils.ts';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
  c: 'code',
};

function useInputHandlers(editor: Editor, fugue: Fugue<string>) {
  function getSelection() {
    if (!editor.selection) return { start: 0, end: 0 };
    const { anchor, focus } = editor.selection;
    const start = anchor.offset;
    const end = focus.offset;
    return { start, end };
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const selection = getSelection();
    if (e.ctrlKey) {
      shortcutHandler(e);
      return;
    }
    switch (e.key) {
      case 'Enter':
        fugue.insertLocal(selection.start, insertNode('\n', []));
        break;
      case 'Backspace':
        if (selection.start === 0 && selection.end == 0) break;
        fugue.deleteLocal(selection.start, selection.end);
        break;
      case 'Tab':
        e.preventDefault();
        editor.insertText('\t');
        fugue.insertLocal(selection.start, insertNode('\t', []));
        break;
      default:
        if (e.key.length !== 1) break;
        fugue.insertLocal(selection.start, insertNode(e.key, []));
        break;
    }
  }

  function onPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const clipboardData = e.clipboardData?.getData('text');
    if (!clipboardData) return;
    const selection = getSelection();
    fugue.insertLocal(selection.start, insertNode(clipboardData, []));
  }

  function shortcutHandler(event: React.KeyboardEvent<HTMLDivElement>) {
    const mark = hotkeys[event.key];
    CustomEditor.toggleMark(editor, mark, fugue);
  }
  return { onKeyDown, onPaste };
}

export default useInputHandlers;
