import { Node, Nodes } from '@notespace/shared/crdt/types';
import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import serviceAccount from '../../../firestore-key-5cddf-472039f8dbb6.json';
import { getFirestore } from 'firebase-admin/firestore';
import { FugueTree } from '@notespace/shared/crdt/fugueTree';

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const db = getFirestore();

export async function getDocument() {
  const docRef = await db.collection('documents').doc('document').get();
  if (docRef.exists) {
    return docRef.data() as Nodes<string>;
  }
  const root: Node<string> = {
    id: { sender: 'root', counter: 0 },
    value: null,
    isDeleted: true,
    parent: null,
    side: 'R',
    leftChildren: [],
    rightChildren: [],
    depth: 0,
    styles: [],
  };
  const nodes = { root: [root] } as Nodes<string>;
  setDocument(nodes);
  return nodes;
}

export async function setDocument(nodes: Nodes<string>) {
  const docRef = db.collection('documents').doc('document');
  await docRef.set(nodes);
}

export async function getTreeInstance() {
  const tree = new FugueTree<string>();
  const nodes = await getDocument();
  const nodesMap = new Map(Object.entries(nodes));
  tree.setTree(nodesMap);
  return tree;
}

export async function updateTree(operation: (tree: FugueTree<string>) => void) {
  const tree = await getTreeInstance();
  operation(tree);
  await setDocument(Object.fromEntries(tree.nodes));
}
