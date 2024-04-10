import { type Editor } from 'slate';
import * as operations from './editorOperations';
import { Fugue } from '@editor/crdt/Fugue';
import { Socket } from 'socket.io-client';

/**
 * Adds markdown support to the editor.
 * @param editor
 * @param fugue
 * @param socket
 */
export function withMarkdown(editor: Editor, fugue: Fugue, socket : Socket) {
  const { deleteBackward, insertText, isInline } = editor;

  editor.insertText = insert => {
    operations.insertText(editor, fugue, socket, insert, insertText);
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
