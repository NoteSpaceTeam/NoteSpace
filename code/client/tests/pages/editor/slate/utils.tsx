import { setup } from '@tests/test-utils.ts';
import { mockCommunication } from '../../../mocks/mockCommunication.ts';
import SlateEditor from '@pages/editor/slate/SlateEditor';
import { Fugue } from '@pages/editor/crdt/fugue.ts';

/**
 * Sets up the editor for testing
 * @returns user and the slate editor
 */
const setupEditor = async () => {
  const fugue = new Fugue();
  const { user, render } = setup(<SlateEditor fugue={fugue} communication={mockCommunication()} />);
  const { findByTestId } = render;
  const editorElement = await findByTestId('editor'); // calls 'act' under the hood, but is more readable
  editorElement.focus();
  return { user, editorElement };
};

/**
 * Cleans up the editor after testing
 */
const cleanupEditor = async () => {
  const editor = document.querySelector('[data-testid="editable"]');
  if (editor) editor.innerHTML = '';
};

export { setupEditor, cleanupEditor };
