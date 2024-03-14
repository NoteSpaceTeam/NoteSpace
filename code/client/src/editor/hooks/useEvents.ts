import useSocketListeners from '../../socket/useSocketListeners.ts';
import { Fugue } from '../crdt/fugue.ts';
import { DeleteMessage, InsertMessage, Node } from '@shared/crdt/types.ts';

function useEvents(fugue: Fugue<unknown>, onDone: () => void) {
  function onOperation<T>(operation: InsertMessage<T> | DeleteMessage) {
    switch (operation.type) {
      case 'insert':
        fugue.insertRemote(operation);
        break;
      case 'delete':
        fugue.deleteRemote(operation);
        break;
      default:
        throw new Error('Invalid operation type');
    }
    onDone();
  }

  function onDocument<T>(nodes: Record<string, Node<T>[]>) {
    const nodesMap = new Map<string, Node<T>[]>(Object.entries(nodes));
    fugue.setTree(nodesMap);
    onDone();
  }

  useSocketListeners({
    operation: onOperation,
    document: onDocument,
  });
}

export default useEvents;
