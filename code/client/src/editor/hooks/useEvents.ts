import useSocketListeners from '@src/socket/useSocketListeners';
import { type Operation } from '@notespace/shared/crdt/types/operations';
import { Document } from '@notespace/shared/crdt/types/document';
import { Communication } from '@editor/domain/communication';
import { FugueDomainOperations } from '@editor/domain/document/fugue/types';

/**
 * Hook client socket listeners to events
 * @param handlers
 * @param communication
 * @param onDone
 */
function useEvents(handlers: FugueDomainOperations, communication: Communication, onDone: () => void) {
  /**
   * Hook socket listeners to an apply an event to the editor
   * @param operations
   */
  function onOperation(operations: Operation[]) {
    handlers.applyOperations(operations);
    onDone();
  }

  function onDocument(document: Document) {
    handlers.initDocument(document);
    onDone();
  }

  useSocketListeners(communication, {
    operation: onOperation,
    document: onDocument,
  });
}

export default useEvents;
