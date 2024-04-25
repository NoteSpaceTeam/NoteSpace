import useSocketListeners from '@src/socket/useSocketListeners';
import { type Operation } from '@notespace/shared/crdt/types/operations';
import { Document } from '@notespace/shared/crdt/types/document';
import { Communication } from '@editor/domain/communication';
import { FugueDomainOperations } from '@editor/domain/document/fugue/types';

/**
 * Hook client socket listeners to events
 * @param fugueOperations
 * @param communication
 * @param onDone
 */
function useEvents(fugueOperations: FugueDomainOperations, communication: Communication, onDone: () => void) {
  /**
   * Hook socket listeners to an apply an event to the editor
   * @param operations
   */
  function onOperation(operations: Operation[]) {
    fugueOperations.applyOperations(operations);
    onDone();
  }

  function onDocument(document: Document) {
    fugueOperations.initDocument(document);
    onDone();
  }

  useSocketListeners(communication, {
    operation: onOperation,
    document: onDocument,
  });
}

export default useEvents;
