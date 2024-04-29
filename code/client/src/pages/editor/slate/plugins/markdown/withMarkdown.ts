import { type Editor } from 'slate';
import operations from './operations/editorOperations.ts';
import markdownHandlers from '@pages/editor/domain/document/markdown/operations.ts';
import { MarkdownDomainOperations } from '@pages/editor/domain/document/markdown/types.ts';
import { Fugue } from '@pages/editor/crdt/fugue.ts';
import { Communication } from '@communication/communication.ts';

/**
 * Adds markdown support to the editor.
 * @param editor
 * @param handlers
 */
export function withMarkdown(editor: Editor, handlers: MarkdownDomainOperations) {
  const { deleteBackward, insertText, isInline, delete: deleteOperation } = editor;
  const editorOperations = operations(editor, handlers);

  editor.insertText = insert => {
    editorOperations.insertText(insert, insertText);
  };
  editor.insertBreak = () => {
    editorOperations.insertBreak();
  };
  editor.delete = options => {
    editorOperations.deleteSelection(deleteOperation, options);
  };
  editor.deleteBackward = (...args) => {
    editorOperations.deleteBackward(deleteBackward, ...args);
  };
  editor.isInline = n => editorOperations.isInline(n, isInline);
  return editor;
}

export function getMarkdownPlugin(fugue: Fugue, communication: Communication) {
  return (editor: Editor) => {
    const handlers = markdownHandlers(fugue, communication);
    return withMarkdown(editor, handlers);
  };
}
