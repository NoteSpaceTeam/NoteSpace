import useSocketListeners from '@src/socket/useSocketListeners';
import { Fugue } from '@src/editor/crdt/fugue';
import { type Node } from '@notespace/shared/crdt/types/nodes';
import { type Operation } from '@notespace/shared/crdt/types/operations';
import { Editor } from 'slate';
import { Document } from '@notespace/shared/crdt/types/document';

/**
 * Hook to listen to the socket events and update the editor accordingly
 * @param editor
 * @param onDone
 */
function useEvents(editor: Editor, onDone: () => void) {
  const fugue = Fugue.getInstance();
  function onOperation(operations: Operation[]) {
    for (const operation of operations) {
      switch (operation.type) {
        case 'insert':
          fugue.insertRemote(operation);
          break;
        case 'delete':
          fugue.deleteRemote(operation);
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
    const nodesMap = new Map<string, Array<Node<string>>>(Object.entries(nodes));
    fugue.setTree(nodesMap);
    onDone();
  }

  function onEditorOperations(operation: string) {
    switch (operation) {
      case 'undo':
        editor.undo();
        break;
      case 'redo':
        editor.redo();
        break;
    }
  }

  useSocketListeners({
    operation: onOperation,
    document: onDocument,
    editorOperations: onEditorOperations,
  });
}

export default useEvents;
