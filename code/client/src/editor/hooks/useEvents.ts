import useSocketListeners from '../../socket/useSocketListeners.ts';
import { type Fugue } from '../crdt/fugue.ts';
import { type Operation, type Node } from '@notespace/shared/crdt/types';

function useEvents(fugue: Fugue<unknown>, onDone: () => void) {
  function onOperation(operation: Operation) {
    switch (operation.type) {
      case 'insert':
        fugue.insertRemote(operation);
        break;
      case 'delete':
        fugue.deleteRemote(operation);
        break;
      case 'style':
        fugue.updateStyle(operation);
        break;
      default:
        throw new Error('Invalid operation type');
    }
    onDone();
  }

  function onDocument<T>(nodes: Record<string, Array<Node<T>>>) {
    const nodesMap = new Map<string, Array<Node<T>>>(Object.entries(nodes));
    fugue.setTree(nodesMap);
    onDone();
  }

  useSocketListeners({
    operation: onOperation,
    document: onDocument,
  });
}

export default useEvents;
