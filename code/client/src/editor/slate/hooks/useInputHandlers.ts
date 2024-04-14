import { type Editor } from 'slate';
import inputEvents from '@editor/slate/events/inputEvents';
import shortcutsEvents from '@editor/slate/events/shortcutEvents';
import historyEvents from '@editor/slate/events/historyEvents';
import useCommunication from '@editor/hooks/useCommunication';
import { Fugue } from '@editor/crdt/fugue';

/**
 * Handles input events
 * @param editor
 * @param fugue
 */
function useInputHandlers(editor: Editor, fugue: Fugue) {
  const communication = useCommunication();
  const history = historyEvents(editor, fugue, communication);
  const { onInput, onCut, onPaste, onSelect } = inputEvents(editor, fugue, communication);
  const { onShortcut } = shortcutsEvents(editor, fugue, communication, history);
  return { onInput, onShortcut, onCut, onPaste, onSelect };
}

export default useInputHandlers;
