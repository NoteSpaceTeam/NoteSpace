import { type Editor } from 'slate';
import * as operations from './editorOperations';
import { Fugue } from '@editor/crdt/Fugue';
import { Communication } from '@socket/communication';
import useCommunication from '@editor/hooks/useCommunication';
import useFugue from '@editor/hooks/useFugue';

/**
 * Adds markdown support to the editor.
 * @param editor
 * @param fugue
 * @param communication
 */
export function withMarkdown(editor: Editor, fugue: Fugue, communication: Communication) {
  const { deleteBackward, insertText, isInline } = editor;

  editor.insertText = insert => {
    operations.insertText(editor, insert, insertText, fugue, communication);
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

export function useMarkdown(editor: Editor) {
  const fugue = useFugue();
  const communication = useCommunication();
  return withMarkdown(editor, fugue, communication);
}
