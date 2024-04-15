import { type Editor } from 'slate';
import inputEvents from '@editor/slate/events/inputEvents';
import shortcutsEvents from '@editor/slate/events/shortcutEvents';
import historyEvents from '@editor/slate/events/historyEvents';
import useCommunication from '@editor/hooks/useCommunication';
import { Fugue } from '@editor/crdt/Fugue';
import inputHandlers from '@editor/domain/events/input/handlers';
import shortcutHandlers from '@editor/domain/events/shortcut/handlers';

/**
 * Handles input events
 * @param editor
 * @param fugue
 */
function useInputHandlers(editor: Editor, fugue: Fugue) {
  const communication = useCommunication();
  const handlersInput = inputHandlers(editor, fugue, communication);
  const handlersShortcut = shortcutHandlers(editor, fugue, communication);

  const history = historyEvents(editor, fugue, communication); // TODO - see with Ricardo

  const { onInput, onCut, onPaste, onSelect } = inputEvents(editor, fugue, communication);

  const { onKeyDown } = shortcutsEvents(editor, fugue, communication, history);
  return { onInput, onKeyDown, onCut, onPaste, onSelect };
}

export default useInputHandlers;
