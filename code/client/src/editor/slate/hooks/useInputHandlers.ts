import type React from 'react';
import { type Fugue } from '@editor/crdt/fugue';
import CustomEditor from '@editor/slate/model/CustomEditor';
import { type Editor } from 'slate';
import useSelection from './useSelection';
import {isEqual} from 'lodash'
import {insertNode } from '@src/editor/crdt/utils';

const hotkeys: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
  c: 'code',
};

function useInputHandlers(editor: Editor, fugue: Fugue) {
  
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) { 
    if (e.ctrlKey) return shortcutHandler(e);
  
    const {selection} = useSelection(editor);
    const {start, end} = selection
    
    switch (e.key) {
      case 'Enter':
        fugue.insertLocal(selection, insertNode('\n', []));
        break;
      case 'Backspace':
        if (isEqual({line: 0, column: 0}, start) && isEqual({line:0, column:0}, end)) break;
        fugue.deleteLocal(selection);
        break;
      case 'Tab':
        e.preventDefault();
        editor.insertText('\t');
        fugue.insertLocal(selection, insertNode('\t', []));
        break;
      default:
        if (e.key.length !== 1) break;
        fugue.insertLocal(selection, insertNode(e.key, []));
        break;
    }
  }

  function onPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    // const clipboardData = e.clipboardData?.getData('text');
    // if (!clipboardData) return;
    // const selection = getSelection();
    // fugue.insertLocal(start, insertNode(clipboardData, []));
  }

  function shortcutHandler(event: React.KeyboardEvent<HTMLDivElement>) {
    const mark = hotkeys[event.key];
    CustomEditor.toggleMark(editor, mark, fugue);
  }
  return { onKeyDown, onPaste };
}

export default useInputHandlers;
