import { type Editor } from 'slate';
import inputEvents from '@editor/slate/events/inputEvents';
import shortcutsEvents from '@editor/slate/events/shortcutEvents';
import { Fugue } from '@editor/crdt/fugue';
import inputHandlers from '@editor/domain/handlers/input/handlers';
import shortcutHandlers from '@editor/domain/handlers/shortcut/handlers';
import historyHandlers from '@editor/domain/handlers/history/handlers';
import historyEvents from '@editor/slate/events/historyEvents';
import {overrideHistoryMethods} from "@editor/slate/plugins/history/utils";
import useCommunication from "@editor/hooks/useCommunication";

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

  // Overrides editor history methods
  const eventsHistory = historyEvents(editor, handlersHistory);
  overrideHistoryMethods(editor, eventsHistory);


  const { onInput, onCut, onPaste, onSelect } = inputEvents(editor, handlersInput);
  const { onShortcut } = shortcutsEvents(editor, handlersShortcut);

  return { onInput, onShortcut, onCut, onPaste, onSelect };
}

export default useInputHandlers;
