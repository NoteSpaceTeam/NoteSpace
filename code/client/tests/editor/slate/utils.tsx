import { setup } from '../../test-utils';
import SlateEditor from '../../../src/editor/slate/SlateEditor';
import { Editor } from 'slate';

/**
 * Sets up the editor for testing
 * @param editor
 * @returns user and the slate editor
 */
const setupEditor = async (editor?: Editor) => {
  const { user, render } = setup(<SlateEditor reactEditor={editor} />);
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
