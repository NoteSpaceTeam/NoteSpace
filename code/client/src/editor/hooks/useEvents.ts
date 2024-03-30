import useSocketListeners from '@src/socket/useSocketListeners';
import { type Fugue } from '@src/editor/crdt/fugue';
import { type Node } from '@notespace/shared/crdt/types/nodes';
import { type Operation } from '@notespace/shared/crdt/types/operations';

function useEvents(fugue: Fugue, onDone: () => void) {
  function onOperation(operations: Operation[]) {
    for (const operation of operations) {
      switch (operation.type) {
        case 'insert':
          fugue.insertRemote(operation);
          break;
        case 'delete':
          fugue.deleteRemote(operation);
          break;
        case 'style':
          fugue.updateStyleRemote(operation);
          break;
        default:
          throw new Error('Invalid operation type');
      }
    }
    onDone();
  }

  function onDocument(nodes: Record<string, Array<Node<string>>>) {
    const nodesMap = new Map<string, Array<Node<string>>>(Object.entries(nodes));
    fugue.setTree(nodesMap);
    onDone();
  }

  useSocketListeners({
    operation: onOperation,
    document: onDocument,
  });
}

export default useEvents;
