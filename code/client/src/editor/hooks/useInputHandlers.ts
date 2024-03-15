import React, { useState } from 'react';
import { Fugue } from '../crdt/fugue.ts';
import CustomEditor from '@src/editor/slate/modules/CustomEditor.tsx';
import { Editor } from 'slate';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
  c: 'code',
};

function useInputHandlers(editor: Editor, fugue: Fugue<string>) {
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  function onSelect() {
    const { anchor, focus } = editor.selection!;
    const start = anchor.offset;
    const end = focus.offset;
    setSelection({ start, end });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey) {
      return shortcutHandler(e);
    }
    switch (e.key) {
      case 'Enter':
        fugue.insertLocal(selection.start, '\n');
        break;
      case 'Backspace': {
        if (selection.start === 0 && selection.end == 0) break;
        fugue.deleteLocal(selection.start, selection.end);
        break;
      }
      default: {
        if (e.key.length !== 1) break;
        fugue.insertLocal(selection.start, e.key);
        break;
      }
    }
  }

  function onPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const clipboardData = e.clipboardData?.getData('text');
    if (!clipboardData) return;
    fugue.insertLocal(selection.start, clipboardData);
  }

  function shortcutHandler(event: React.KeyboardEvent<HTMLDivElement>) {
    // switch (event.key) {
    //   case 'm': {
    //     event.preventDefault();
    //     CustomEditor.toggleCodeBlock(editor);
    //     break;
    //   }
    //   case 'b': {
    //     event.preventDefault();
    //     CustomEditor.toggleBoldMark(editor);
    //     break;
    //   }
    // }
    const mark = hotkeys[event.key!];
    CustomEditor.toggleMark(editor, mark);
  }
  return { onKeyDown, onPaste, onSelect };
}

export default useInputHandlers;
