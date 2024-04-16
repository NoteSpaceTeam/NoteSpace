import { type Editor } from 'slate';
import inputEvents from '@editor/slate/events/inputEvents';
import shortcutsEvents from '@editor/slate/events/shortcutEvents';
import historyEvents from '@editor/slate/events/historyEvents';
import useCommunication from '@editor/hooks/useCommunication';
import { Fugue } from '@editor/crdt/fugue';
import inputHandlers from '@editor/domain/input/handlers';
import shortcutHandlers from '@editor/domain/shortcut/handlers';
import historyHandlers from '@editor/domain/history/handlers';

/**
 * Handles input events
 * @param editor
 * @param fugue
 */
function useInputHandlers(editor: Editor, fugue: Fugue) {
  const communication = useCommunication();
  const handlersInput = inputHandlers(fugue, communication);
  const handlersShortcut = shortcutHandlers(editor, fugue, communication);
  const handlersHistory = historyHandlers(fugue, communication);

  const history = historyEvents(editor, handlersHistory);
  const { onInput, onCut, onPaste, onSelect } = inputEvents(editor, handlersInput);
  const { onShortcut } = shortcutsEvents(editor, handlersShortcut, history);

  return { onInput, onShortcut, onCut, onPaste, onSelect };
}

export default useInputHandlers;
