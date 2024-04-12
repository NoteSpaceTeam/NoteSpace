import { DocumentDatabase } from '@src/types';
import { Document } from '@notespace/shared/crdt/types/document';
import { Nodes } from '@notespace/shared/crdt/types/nodes';
import { emptyTree } from '@notespace/shared/crdt/utils';

export default function DocumentDatabase(): DocumentDatabase {
  let nodes: Nodes<string> = emptyTree();
  let title = '';

  async function getDocument(): Promise<Document> {
    return { title, nodes };
  }

  function updateDocument(newNodes: Nodes<string>) {
    nodes = newNodes;
  }

  function updateTitle(newTitle: string) {
    title = newTitle;
  }

  function deleteDocument() {
    nodes = emptyTree();
    title = '';
  }

  return {
    getDocument,
    deleteDocument,
    updateDocument,
    updateTitle,
  };
}
