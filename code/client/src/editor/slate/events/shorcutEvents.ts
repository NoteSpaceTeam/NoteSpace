import { InputEvents } from './inputEvents';

/**
 * Handles keyboard shortcuts
 * @param event
 */
export default function shortcutHandler(
  e: KeyboardEvent,
  { undo, redo, onCtrlBackspace, onCtrlDelete, onFormat }: InputEvents
) {
  switch (e.key) {
    case 'z':
      undo();
      break;
    case 'y':
      redo();
      break;
    case 'Backspace':
      onCtrlBackspace();
      break;
    case 'Delete':
      onCtrlDelete();
      break;
    default:
      onFormat(e.key);
      break;
  }
}
