import useSocketListeners from '@communication/socket/useSocketListeners.ts';
import { type Operation } from '@notespace/shared/crdt/types/operations.ts';
import { Communication } from '@communication/communication.ts';
import { FugueDomainOperations } from '@pages/editor/domain/document/fugue/types.ts';

/**
 * Hook client socket listeners to events
 * @param fugueOperations
 * @param communication
 * @param onDone
 */
function useEvents(fugueOperations: FugueDomainOperations, { socket }: Communication, onDone: () => void) {
  function onOperation(operations: Operation[]) {
    fugueOperations.applyOperations(operations);
    onDone();
  }

  useSocketListeners(socket, {
    operation: onOperation,
  });
}

export default useEvents;
