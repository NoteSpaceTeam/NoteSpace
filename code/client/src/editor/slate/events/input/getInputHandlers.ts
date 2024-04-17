import { type Editor } from 'slate';
import inputEvents from '@editor/slate/events/input/inputEvents';
import shortcutsEvents from '@editor/slate/events/shortcut/shortcutEvents';
import { Fugue } from '@editor/crdt/fugue';
import inputHandlers from '@editor/domain/document/input/operations';
import shortcutHandlers from '@editor/domain/document/shortcut/handlers';
import { Communication } from '@editor/domain/communication';

/**
 * Handles input events
 * @param editor
 * @param fugue
 * @param communication
 */
function getInputHandlers(editor: Editor, fugue: Fugue, communication: Communication) {
  const handlersInput = inputHandlers(fugue, communication);
  const handlersShortcut = shortcutHandlers(editor, fugue, communication);
  const { onInput, onCut, onPaste, onCursorChange } = inputEvents(editor, handlersInput);
  const { onShortcut } = shortcutsEvents(editor, handlersShortcut);
  return { onInput, onShortcut, onCut, onPaste, onCursorChange };
}

export default getInputHandlers;
