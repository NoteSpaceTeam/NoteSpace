import useSocketListeners from '@src/socket/useSocketListeners';
import { Fugue } from '@src/editor/crdt/fugue';
import { type Operation } from '../../../../shared/crdt/types/operations.ts';
import { Editor } from 'slate';
import { Document } from '@notespace/shared/crdt/types/document';
import { FugueNode } from '@editor/crdt/types.ts';

/**
 * Hook client socket listeners to events
 * @param editor
 * @param onDone
 */
function useEvents(editor: Editor, onDone: () => void) {
  const fugue = Fugue.getInstance();

  /**
   * Hook socket listeners to an edit event
   * @param operations - Edit operations
   */
  function onOperation(operations: Operation[]) {
    for (const operation of operations) {
      switch (operation.type) {
        case 'insert':
          fugue.insertRemote(operation);
          break;
        case 'delete':
          fugue.deleteRemote(operation);
          break;
        case 'editor':
          //editor.apply(operation.operation);
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
    const nodesMap = new Map<string, Array<FugueNode>>(Object.entries(nodes));
    fugue.setTree(nodesMap);
    onDone();
  }

  useSocketListeners({
    operation: onOperation,
    document: onDocument,
  });
}

export default useEvents;
