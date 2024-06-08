import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { type Operation } from '@notespace/shared/src/document/types/operations';
import { Communication } from '@services/communication/communication';
import { FugueDomainOperations } from '@domain/editor/fugue/operations/fugue/types';
import {Editor, Transforms, Location} from 'slate';
import { Cursor } from '@domain/editor/cursor';
import {cursorToPoint, getSelection} from "@domain/editor/slate/utils/selection";
import {isEqual} from "lodash";


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
    const {start: selectionStart, end: selectionEnd} = getSelection(editor);

    operations.forEach((op: Operation) => {
      if (['insert', 'delete', 'revive'].includes(op.type)) {
        const { cursor } = op as Operation & { cursor: Cursor };

        if(cursor.line !== selectionEnd.line) return;
        if(cursor.column > selectionEnd.column) return;

        // Update the cursor position
        const delta = ['insert', 'revive'].includes(op.type) ? 1 : -1;

        // Move start and end cursor if the selection is collapsed or inserting or reviving
        if(delta > 0 || isEqual(selectionStart, selectionEnd)) {
          selectionStart.column += delta;
        }
        selectionEnd.column += delta;
      }

      const newSelection : Location = {
        anchor: cursorToPoint(editor, selectionStart),
        focus: cursorToPoint(editor, selectionEnd),
      };

      console.log("New selection", newSelection);
      Transforms.select(editor, newSelection);
    });
    onDone();
  }

  useSocketListeners(socket, {
    operations: onOperation,
  });
}

export default useEvents;
