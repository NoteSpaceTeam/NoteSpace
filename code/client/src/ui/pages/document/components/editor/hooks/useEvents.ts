import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { type Operation } from '@notespace/shared/src/document/types/operations';
import { Communication } from '@services/communication/communication';
import { FugueDomainOperations } from '@domain/editor/fugue/operations/fugue/types';
import { Editor, Transforms, Selection } from 'slate';
import { Cursor } from '@domain/editor/cursor';

/**
 * Hook client socket listeners to events
 * @param editor
 * @param fugueOperations
 * @param communication
 * @param onDone
 */
function useEvents(
  editor: Editor,
  fugueOperations: FugueDomainOperations,
  { socket }: Communication,
  onDone: () => void
) {
  function onOperation(operations: Operation[]) {
    fugueOperations.applyOperations(operations);

    operations.forEach((op: Operation) => {
      if (['insert', 'delete', 'revive'].includes(op.type)) {
        const { cursor } = op as Operation & { cursor: Cursor };
        const currSelection = editor.selection;

        if (currSelection) {
          const { anchor, focus } = currSelection;
          const newStart = { ...anchor };
          const newEnd = { ...focus };

          if (cursor.line === anchor.path[0]) {
            if (op.type === 'insert') {
              if (cursor.column <= anchor.offset) {
                newStart.offset += op.value.length;
              }
              if (cursor.column <= focus.offset) {
                newEnd.offset += op.value.length;
              }
            } else if (op.type === 'delete') {
              if (cursor.column < anchor.offset) {
                newStart.offset = Math.max(anchor.offset - 1, cursor.column);
              }
              if (cursor.column < focus.offset) {
                newEnd.offset = Math.max(focus.offset - 1, cursor.column);
              }
            }
          }
          const newSelection: Selection = {
            anchor: newStart,
            focus: newEnd,
          };
          Transforms.select(editor, newSelection);
        }
      }
    });
    onDone();
  }

  useSocketListeners(socket, {
    operations: onOperation,
  });
}

export default useEvents;
