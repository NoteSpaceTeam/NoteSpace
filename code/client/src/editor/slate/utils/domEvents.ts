const inputEventsKeys: Record<string, string> = {
  deleteContentBackward: 'Backspace',
  insertLineBreak: 'Enter',
  insertParagraph: 'Enter',
  insertCompositionText: 'Paste',
  insertFromComposition: 'Paste',
  insertFromDrop: 'Paste',
  insertFromPaste: 'Paste',
  deleteContentForward: 'Delete',
  deleteByCut: 'Delete',
  deleteByDrag: 'Delete',
  deleteByKeyboard: 'Delete',
  deleteContent: 'Delete',
} as const;

export const getKeyFromInputEvent = (e: InputEvent) =>
  e.inputType === 'insertText' ? e.data : inputEventsKeys[e.inputType];
