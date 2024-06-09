import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { type Operation } from '@notespace/shared/src/document/types/operations';
import { Editor, Transforms, Location } from 'slate';
import { Cursor } from '@domain/editor/cursor';
import { cursorToPoint, getSelection } from '@domain/editor/slate/utils/selection';
import { isEqual } from 'lodash';
import { ServiceConnector } from '@domain/editor/connectors/service/connector';

/**
 * Hook client socket listeners to events
 * @param editor
 * @param connector
 * @param onDone
 */
function useEvents(editor: Editor, connector: ServiceConnector, onDone: () => void) {
  function onOperation(operations: Operation[]) {
    connector.applyFugueOperations(operations);
    const { start: selectionStart, end: selectionEnd } = getSelection(editor);

    operations.forEach((op: Operation) => {
      if (['insert', 'delete', 'revive'].includes(op.type)) {
        const { cursor } = op as Operation & { cursor: Cursor };

        if (cursor.line !== selectionEnd.line) return;
        if (cursor.column > selectionEnd.column) return;

        // update the cursor position
        const delta = ['insert', 'revive'].includes(op.type) ? 1 : -1;

        // move start and end cursor if the selection is collapsed or inserting or reviving
        if (delta > 0 || isEqual(selectionStart, selectionEnd)) {
          selectionStart.column += delta;
        }
        selectionEnd.column += delta;
      }
      const newSelection: Location = {
        anchor: cursorToPoint(editor, selectionStart),
        focus: cursorToPoint(editor, selectionEnd),
      };
      Transforms.select(editor, newSelection);
    });
    onDone();
  }
  connector.on('operations', onOperation);

  useSocketListeners(connector.communication.socket, connector.getEvents()); // listens to all socket events
}

export default useEvents;
