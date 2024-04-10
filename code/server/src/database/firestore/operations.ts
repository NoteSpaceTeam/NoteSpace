import { getNodes, getTitle, setTitle, updateNodes } from '@database/firestore/firestore';
import { DocumentDatabase } from '@src/types';
import { Document } from '@notespace/shared/crdt/types/document';
import { Nodes } from '@notespace/shared/crdt/types/nodes';

export default function DocumentDatabase(): DocumentDatabase {
  async function getDocument(): Promise<Document> {
    const nodes = await getNodes();
    const title = await getTitle();
    return { title, nodes };
  }

  async function updateDocument(newNodes: Nodes<string>) {
    await updateNodes(newNodes);
  }

  async function updateTitle(title: string) {
    await setTitle(title);
  }

  async function deleteDocument() {
    await updateNodes({});
  }

  return {
    getDocument,
    updateDocument,
    updateTitle,
    deleteDocument,
  };
}
