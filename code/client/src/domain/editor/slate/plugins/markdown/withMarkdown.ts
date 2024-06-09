import { type Editor } from 'slate';
import operations from './operations/editorOperations';
import { MarkdownConnector } from '@domain/editor/connectors/markdown/types';

/**
 * Adds markdown support to the editor.
 * @param editor
 * @param connector
 */
export function withMarkdown(editor: Editor, connector: MarkdownConnector) {
  const { deleteBackward, insertText, isInline, delete: deleteOperation } = editor;
  const editorOperations = operations(editor, connector);

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

export function getMarkdownPlugin(connector: MarkdownConnector) {
  return (editor: Editor) => withMarkdown(editor, connector);
}
