import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@tests/test-utils';
import { mockCommunication } from '../../mocks/mockCommunication';
import Editor from '@ui/pages/document/components/editor/Editor';
import { Fugue } from '@domain/editor/crdt/fugue';

describe('SlateEditor', () => {
  const fugue = new Fugue();
  let editor: HTMLElement;

  beforeEach(async () => {
    const { findByTestId } = render(<Editor title={''} fugue={fugue} communication={mockCommunication()} />);
    editor = await findByTestId('editor');
    editor.focus();
  });

  test('should render the editor', async () => {
    const documentTitle = screen.getByPlaceholderText('Untitled');
    expect(documentTitle).toBeInTheDocument();
  });
});
