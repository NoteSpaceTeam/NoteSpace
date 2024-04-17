import { setup } from '../../test-utils';
import DocumentEditor from '@editor/DocumentEditor';
import { Editor } from 'slate';

/**
 * Sets up the editor for testing
 * @param editor
 * @returns user and the slate editor
 */
const setupEditor = async (editor?: DocumentEditor) => {
  const { user, render } = setup(<Editor editor={editor} />);
  const { findByTestId } = render;
  const editorElement = await findByTestId('editor'); // calls 'act' under the hood, but is more readable
  editorElement.focus();
  return { user, editorElement };
};

/**
 * Cleans up the editor after testing
 */
const cleanupEditor = async () => {
  // cleanup
  const editor = document.querySelector('[data-testid="editable"]');
  if (editor) editor.innerHTML = '';
};

export { setupEditor, cleanupEditor };
