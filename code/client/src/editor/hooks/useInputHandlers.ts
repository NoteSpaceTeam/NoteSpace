import React, { FormEvent, SyntheticEvent, useState } from 'react';
import { Fugue } from '../crdt/fugue.ts';
import { getInputType, InputType } from '../input/utils.ts';

function useInputHandlers(fugue: Fugue<unknown>) {
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  function onSelect(e: SyntheticEvent<HTMLTextAreaElement>) {
    const start = e.currentTarget.selectionStart;
    const end = e.currentTarget.selectionEnd;
    setSelection({ start, end });
  }

  function onInput(e: FormEvent<HTMLTextAreaElement>) {
    const inputType = getInputType((e.nativeEvent as InputEvent).inputType);
    if (inputType === InputType.insertFromPaste) return;
    const selectionStart = selection.start;
    const selectionEnd = selection.end;

    switch (inputType) {
      case InputType.insertLineBreak:
        fugue.insertLocal(selectionStart, '\n');
        break;
      case InputType.insertText: {
        const endIndex = selectionEnd === selectionStart ? selectionStart + 1 : selectionEnd + 1;
        const char = e.currentTarget.value.slice(selectionStart, endIndex);
        fugue.insertLocal(selectionStart, char);
        break;
      }
      case InputType.deleteContentBackward: {
        if (selectionStart === 0 && selectionEnd == 0) break;
        fugue.deleteLocal(selectionStart, selectionEnd);
        break;
      }
    }
  }
  function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const selectionStart = e.currentTarget.selectionStart;
    const clipboardData = e.clipboardData?.getData('text');
    if (!clipboardData) return;
    fugue.insertLocal(selectionStart, clipboardData);
  }
  return { onInput, onSelect, onPaste };
}

export default useInputHandlers;
