import { type Editor } from 'slate';
import operations from './operations/editorOperations';
import { MarkdownHandlers } from '@editor/domain/markdown/types';

/**
 * Adds markdown support to the editor.
 * @param editor
 * @param handlers
 */
export function withMarkdown(editor: Editor, handlers: MarkdownHandlers) {
  const { deleteBackward, insertText, isInline, delete: deleteOperation } = editor;
  const editorOperations = operations(editor, handlers);

  editor.insertText = insert => {
    editorOperations.insertText(insert, insertText);
  };
  editor.insertBreak = () => {
    editorOperations.insertBreak();
  };
  editor.delete = options => {
    editorOperations.delete(deleteOperation, options);
  };
  editor.deleteBackward = (...args) => {
    editorOperations.deleteBackward(deleteBackward, ...args);
  };
  editor.isInline = n => editorOperations.isInline(n, isInline);
  return editor;
}
