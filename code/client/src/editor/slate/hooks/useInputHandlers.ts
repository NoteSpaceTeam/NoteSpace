import { Fugue } from '@editor/crdt/Fugue';
import { type Editor } from 'slate';
import inputEvents from '@editor/slate/events/inputEvents';
import shortcutsEvents from '@editor/slate/events/shortcutEvents';
import historyEvents from '@editor/slate/events/historyEvents';
import { Socket } from 'socket.io-client';

/**
 * Handles input events
 * @param editor
 * @param fugue
 * @param socket
 * @returns
 */
function useInputHandlers(editor: Editor, fugue: Fugue, socket : Socket) {
  const { undo, redo } = historyEvents(editor, fugue, socket);
  const { onInput, onPaste, onCut, onSelect } = inputEvents(editor, fugue, socket);
  const { onKeyDown } = shortcutsEvents(editor, fugue, socket, { undo, redo });

  return { onInput, onKeyDown, onPaste, onCut, onSelect };
}

export default useInputHandlers;
