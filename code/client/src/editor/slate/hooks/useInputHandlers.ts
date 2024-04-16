import { type Editor } from 'slate';
import inputEvents from '@editor/slate/events/inputEvents';
import shortcutsEvents from '@editor/slate/events/shortcutEvents';
import { Fugue } from '@editor/crdt/fugue';
import inputHandlers from '@editor/domain/handlers/input/handlers';
import shortcutHandlers from '@editor/domain/handlers/shortcut/handlers';
import useCommunication from '@editor/hooks/useCommunication';

/**
 * Handles input events
 * @param editor
 * @param fugue
 */
function useInputHandlers(editor: Editor, fugue: Fugue) {
  const communication = useCommunication();
  const handlersInput = inputHandlers(fugue, communication);
  const handlersShortcut = shortcutHandlers(editor, fugue, communication);
  const { onInput, onCut, onPaste, onCursorChange } = inputEvents(editor, handlersInput);
  const { onShortcut } = shortcutsEvents(editor, handlersShortcut);
  return { onInput, onShortcut, onCut, onPaste, onCursorChange };
}

export default useInputHandlers;
