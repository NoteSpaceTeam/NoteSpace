import useSocketListeners from '@/services/communication/socket/useSocketListeners';
import { type Operation } from '@notespace/shared/src/document/types/operations.ts';
import { Communication } from '@/services/communication/communication';
import { FugueDomainOperations } from '@domain/editor/operations/fugue/types';

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
