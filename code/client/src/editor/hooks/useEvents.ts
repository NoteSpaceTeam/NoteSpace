import useSocketListeners from '@src/socket/useSocketListeners';
import { type Operation } from '@notespace/shared/crdt/types/operations';
import { Document } from '@notespace/shared/crdt/types/document';
import { Fugue } from '@editor/crdt/fugue';
/**
 * Hook client socket listeners to events
 * @param fugue
 * @param onDone
 */
function useEvents(fugue: Fugue, onDone: () => void) {
  /**
   * Hook socket listeners to an edit event
   * @param operations - Edit operations
   */
  function onOperation(operations: Operation[]) {
    for (const operation of operations) {
      switch (operation.type) {
        case 'insert':
          fugue.insertRemote(operation);
          break;
        case 'delete':
          fugue.deleteRemote(operation);
          break;
        case 'inline-style':
          fugue.updateInlineStyleRemote(operation);
          break;
        case 'block-style':
          fugue.updateBlockStyleRemote(operation);
          break;
        default:
          throw new Error('Invalid operation type');
      }
    }
    onDone();
  }

  function onDocument({ nodes }: Document) {
    fugue.init(nodes);
    onDone();
  }

  useSocketListeners({
    operation: onOperation,
    document: onDocument,
  });
}

export default useEvents;
