import { type Editor } from 'slate';
import inputEvents from '@editor/slate/handlers/input/inputHandlers';
import { Fugue } from '@editor/crdt/fugue';
import inputHandlers from '@editor/domain/document/input/operations';
import markdownHandlers from '@editor/domain/document/markdown/operations';
import { Communication } from '@editor/domain/communication';
import markdownEvents from '@editor/slate/handlers/markdown/markdownHandlers';

/**
 * Handles input events
 * @param editor
 * @param fugue
 * @param communication
 */
function getEventHandlers(editor: Editor, fugue: Fugue, communication: Communication) {
  // operation handlers
  const handlersMarkdown = markdownHandlers(fugue, communication);
  const handlersInput = inputHandlers(fugue, communication);

  // event handlers
  const { onFormat } = markdownEvents(editor, handlersMarkdown);
  const { onInput, onCut, onPaste, onSelectionChange, onShortcut } = inputEvents(editor, handlersInput, onFormat);

  return { onInput, onCut, onPaste, onSelectionChange, onShortcut, onFormat };
}

export default getEventHandlers;
