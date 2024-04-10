import { type Editor } from 'slate';
import * as operations from './editorOperations';
import { Fugue } from '@editor/crdt/fugue';

/**
 * Adds markdown support to the editor.
 * @param editor
 * @param fugue
 */
export function withMarkdown(editor: Editor, fugue: Fugue) {
  const { deleteBackward, insertText, isInline } = editor;

  editor.insertText = insert => {
    operations.insertText(editor, insertText, insert, fugue);
  };
  editor.insertBreak = () => {
    operations.insertBreak(editor);
  };
  editor.deleteBackward = (...args) => {
    operations.deleteBackward(editor, deleteBackward, ...args);
  };
  editor.isInline = n => operations.isInline(n, isInline);
  return editor;
}
