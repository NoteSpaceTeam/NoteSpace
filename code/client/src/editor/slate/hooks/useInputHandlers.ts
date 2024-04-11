import { type Editor } from 'slate';
import inputEvents from '@editor/slate/events/inputEvents';
import shortcutsEvents from '@editor/slate/events/shortcutEvents';
import historyEvents from '@editor/slate/events/historyEvents';
import useCommunication from '@editor/hooks/useCommunication';
import useFugue from '@editor/hooks/useFugue';

/**
 * Handles input events
 * @param editor
 */
function useInputHandlers(editor: Editor) {
  const fugue = useFugue();
  const communication = useCommunication();

  const history = historyEvents(editor, fugue, communication);
  const { onInput, onPaste, onCut, onSelect } = inputEvents(editor, fugue, communication);
  const { onKeyDown } = shortcutsEvents(editor, fugue, communication, history);

  return { onInput, onKeyDown, onPaste, onCut, onSelect };
}

export default useInputHandlers;
