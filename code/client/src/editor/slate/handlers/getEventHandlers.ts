import { type Editor } from 'slate';
import inputHandlers from '@editor/slate/handlers/input/inputHandlers';
import { Fugue } from '@editor/crdt/fugue';
import inputDomainOperations from '@editor/domain/document/input/operations';
import markdownDomainOperations from '@editor/domain/document/markdown/operations';
import { Communication } from '@editor/domain/communication';
import markdownHandlers from '@editor/slate/handlers/markdown/markdownHandlers';

/**
 * Handles input events
 * @param editor
 * @param fugue
 * @param communication
 */
function getEventHandlers(editor: Editor, fugue: Fugue, communication: Communication) {
  // operation handlers
  const markdownOperations = markdownDomainOperations(fugue, communication);
  const inputOperations = inputDomainOperations(fugue, communication);

  // event handlers
  const { onFormat } = markdownHandlers(editor, markdownOperations);
  const { onInput, onCut, onPaste, onSelectionChange, onShortcut } = inputHandlers(editor, inputOperations, onFormat);

  return { onInput, onCut, onPaste, onSelectionChange, onShortcut, onFormat };
}

export default getEventHandlers;
