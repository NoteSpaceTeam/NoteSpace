import { Editor } from 'slate';
import * as operations from './operations.ts';

/**
 * Adds markdown support to the editor.
 * @param editor
 */
export function withMarkdown(editor: Editor) {
  const { deleteBackward, insertText, isInline } = editor;

  editor.insertText = insert => operations.insertText(editor, insertText, insert);
  editor.insertBreak = () => operations.insertBreak(editor);
  editor.deleteBackward = (...args) => operations.deleteBackward(editor, deleteBackward, ...args);
  editor.isInline = n => operations.isInline(n, isInline);
  //(Element.isElement(n) && n.type === 'inline-code') || isInline(n);
  return editor;
}
