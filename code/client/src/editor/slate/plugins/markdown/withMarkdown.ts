import { type Editor } from 'slate';
import operations from './operations/editorOperations';
import markdownHandlers from '@editor/domain/document/markdown/operations';
import { MarkdownDomainOperations } from '@editor/domain/document/markdown/types';
import { Fugue } from '@editor/crdt/fugue';
import { Communication } from '@editor/domain/communication';

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
