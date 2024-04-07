const inputEventToKey: Record<string, string> = {
  deleteContentBackward: 'Backspace',
  deleteContentForward: 'Delete',
  insertLineBreak: 'Enter',
  insertParagraph: 'Enter',
  insertCompositionText: 'Paste',
  insertFromComposition: 'Paste',
  insertFromDrop: 'Paste',
  insertFromPaste: 'Paste',
} as const;

export function getKeyFromInputEvent(e: InputEvent) {
  if (e.inputType === 'insertText') {
    return e.data;
  }
  return inputEventToKey[e.inputType];
}

export function getClipboardEvent(e: InputEvent) {
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', e.data || '');
  return new ClipboardEvent('paste', { clipboardData: dataTransfer });
}
