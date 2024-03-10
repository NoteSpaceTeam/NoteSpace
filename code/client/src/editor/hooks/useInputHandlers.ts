import { FormEvent, SyntheticEvent, useState } from 'react';
import { Fugue } from '../crdt/fugue.ts';

function useInputHandlers(fugue: Fugue<unknown>) {
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  function onSelect(e: SyntheticEvent<HTMLTextAreaElement>) {
    const start = e.currentTarget.selectionStart;
    const end = e.currentTarget.selectionEnd;
    setSelection({ start, end });
  }

  function onInput(e: FormEvent<HTMLTextAreaElement>) {
    const inputType = (e.nativeEvent as InputEvent).inputType;
    if (inputType === 'insertFromPaste') return;
    const selectionStart = selection.start;
    const selectionEnd = selection.end;

    switch (inputType) {
      case 'insertLineBreak':
        fugue.insertLocal(selectionStart, '\n');
        break;
      case 'insertText': {
        const char = e.currentTarget.value.slice(selectionStart - 1, selectionEnd);
        console.log('insert', selectionStart - 1);
        fugue.insertLocal(selectionStart - 1, char);
        break;
      }
      case 'deleteContentBackward': {
        console.log('delete', selectionStart, selectionEnd);
        if (selectionStart === 0 && selectionEnd == 0) break;
        fugue.deleteLocal(selectionStart, selectionEnd);
        break;
      }
    }
  }
  function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    const selectionStart = e.currentTarget.selectionStart;
    const clipboardData = e.clipboardData?.getData('text');
    if (!clipboardData) return;
    fugue.insertLocal(selectionStart, clipboardData);
  }
  return { onInput, onSelect, onPaste };
}

export default useInputHandlers;
