import { type Editor } from 'slate';
import inputHandlers from '@src/components/editor/slate/handlers/input/inputHandlers.ts';
import { Fugue } from '@src/components/editor/crdt/fugue.ts';
import inputDomainOperations from '@src/components/editor/domain/document/input/operations.ts';
import markdownDomainOperations from '@src/components/editor/domain/document/markdown/operations.ts';
import { Communication } from '@src/communication/communication.ts';
import markdownHandlers from '@src/components/editor/slate/handlers/markdown/markdownHandlers.ts';

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
