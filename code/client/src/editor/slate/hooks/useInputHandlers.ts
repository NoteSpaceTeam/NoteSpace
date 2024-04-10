import { Fugue } from '@editor/crdt/fugue';
import { type Editor } from 'slate';
import useHistory from '@editor/slate/hooks/useHistory';
import inputEvents from '@editor/slate/events/inputEvents';
import shortcutsEvents from '@editor/slate/events/shortcutsEvents';



/**
 * Handles input events
 * @param editor
 * @param fugue
 * @returns
 */
function useInputHandlers(editor: Editor, fugue : Fugue) {
  const { undo, redo } = useHistory(editor);
  const {onInput, onPaste, onCut, onSelect} = inputEvents(editor, fugue);
  const {onKeyDown} = shortcutsEvents(editor, fugue, {undo, redo});


  return {onInput, onKeyDown, onPaste, onCut, onSelect};
}

export default useInputHandlers;
