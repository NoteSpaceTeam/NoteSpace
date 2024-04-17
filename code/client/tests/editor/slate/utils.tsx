import { setup } from '../../test-utils';
import { mockCommunication } from '../mocks/mockCommunication';
import SlateEditor from '@editor/slate/SlateEditor';

/**
 * Sets up the editor for testing
 * @returns user and the slate editor
 */
const setupEditor = async () => {
  const { user, render } = setup(<SlateEditor communication={mockCommunication()} />);
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
