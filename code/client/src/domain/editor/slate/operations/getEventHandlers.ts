import { type Editor } from 'slate';
import inputHandlers from '@domain/editor/slate/operations/input/operations';
import { Fugue } from '@domain/editor/fugue/Fugue';
import inputDomainOperations from '@domain/editor/fugue/operations/input/operations';
import markdownDomainOperations from '@domain/editor/fugue/operations/markdown/operations';
import { Communication } from '@services/communication/communication';
import markdownHandlers from '@domain/editor/slate/operations/markdown/operations';

/**
 * Handles input events
 * @param editor
 * @param syncEditor
 * @param fugue
 * @param communication
 */
function getEventHandlers(
    editor: Editor,
    fugue: Fugue,
    communication: Communication
) {
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
