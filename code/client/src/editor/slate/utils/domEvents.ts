const inputEventsKeys: Record<string, string> = {
  deleteContentBackward: 'Backspace',
  deleteContentForward: 'Delete',
  insertLineBreak: 'Enter',
  insertParagraph: 'Enter',
  insertCompositionText: 'Paste',
  insertFromComposition: 'Paste',
  insertFromDrop: 'Paste',
  insertFromPaste: 'Paste',
} as const;

export const getKeyFromInputEvent = (e: InputEvent) =>
  (e.inputType === 'insertText') ? e.data : inputEventsKeys[e.inputType];

export function getClipboardEvent(e: InputEvent): ClipboardEvent {
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', e.data || '');
  return new ClipboardEvent('paste', { clipboardData: dataTransfer });
}
