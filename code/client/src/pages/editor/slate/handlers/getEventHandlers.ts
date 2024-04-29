import { type Editor } from 'slate';
import inputHandlers from '@pages/editor/slate/handlers/input/inputHandlers.ts';
import { Fugue } from '@pages/editor/crdt/fugue.ts';
import inputDomainOperations from '@pages/editor/domain/document/input/operations.ts';
import markdownDomainOperations from '@pages/editor/domain/document/markdown/operations.ts';
import { Communication } from '@communication/communication.ts';
import markdownHandlers from '@pages/editor/slate/handlers/markdown/markdownHandlers.ts';

/**
 * Handles input events
 * @param editor
 * @param fugue
 * @param communication
 */
function getEventHandlers(editor: Editor, fugue: Fugue, communication: Communication) {
  // domain operations
  const markdownOperations = markdownDomainOperations(fugue, communication);
  const inputOperations = inputDomainOperations(fugue, communication);

  // event handlers
  const { onFormat } = markdownHandlers(editor, markdownOperations);
  const { onInput, onCut, onPaste, onSelectionChange, onBlur, onShortcut } = inputHandlers(
    editor,
    inputOperations,
    onFormat
  );

  // return event handlers
  return { onInput, onCut, onPaste, onSelectionChange, onBlur, onShortcut, onFormat };
}

export default getEventHandlers;
