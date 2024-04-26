import { setup } from '../../test-utils';
import { mockCommunication } from '../mocks/mockCommunication';
import SlateEditor from '@src/components/editor/slate/SlateEditor';
import { Fugue } from '@src/components/editor/crdt/fugue.ts';

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
