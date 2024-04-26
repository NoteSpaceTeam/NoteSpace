import useSocketListeners from '@src/communication/socket/useSocketListeners.ts';
import { type Operation } from '@notespace/shared/crdt/types/operations.ts';
import { Communication } from '@src/communication/communication.ts';
import { FugueDomainOperations } from '@src/components/editor/domain/document/fugue/types.ts';

/**
 * Hook client socket listeners to events
 * @param fugueOperations
 * @param communication
 * @param onDone
 */
function useEvents(fugueOperations: FugueDomainOperations, communication: Communication, onDone: () => void) {
  function onOperation(operations: Operation[]) {
    fugueOperations.applyOperations(operations);
    onDone();
  }

  useSocketListeners(communication, {
    operation: onOperation,
  });
}

export default useEvents;
