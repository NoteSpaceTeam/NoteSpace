import useSocketListeners from '@src/socket/useSocketListeners';
import { type Operation } from '@notespace/shared/crdt/types/operations';
import { Document } from '@notespace/shared/crdt/types/document';
import { Fugue } from '@editor/crdt/Fugue';
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
    console.log('onOperation', operations);
    for (const operation of operations) {
      switch (operation.type) {
        case 'insert':
          console.log('Event fugue: ', fugue);
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
    console.log('onDocument', nodes);
    fugue.setTree(nodes);
    onDone();
  }

  useSocketListeners({
    operation: onOperation,
    document: onDocument,
  });
}

export default useEvents;
