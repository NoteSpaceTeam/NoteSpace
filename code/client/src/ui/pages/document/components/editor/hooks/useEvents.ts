import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { type Operation } from '@notespace/shared/src/document/types/operations';
import { ServiceConnector } from '@domain/editor/connectors/service/connector';

/**
 * Hook client socket listeners to events
 * @param connector
 * @param onDone
 */
function useEvents(connector: ServiceConnector, onDone: () => void) {
  function onOperation(operations: Operation[]) {
    connector.applyFugueOperations(operations);
    onDone();
  }
  connector.on('operations', onOperation);

  useSocketListeners(connector.communication.socket, connector.getEvents()); // listens to all socket events
}

export default useEvents;
