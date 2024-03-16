import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../../firestore-key-5cddf-472039f8dbb6.json';
import { Nodes, Node, InsertMessage, DeleteMessage } from '@shared/crdt/types';
import { FugueTree } from '@shared/crdt/fugueTree';

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const db = getFirestore();

async function getDocument() {
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
  };
  const nodes = { root: [root] } as Nodes<string>;
  setDocument(nodes);
  return nodes;
}

async function setDocument(nodes: Nodes<string>) {
  const docRef = db.collection('documents').doc('document');
  await docRef.set(nodes);
}

async function getTreeInstance() {
  const tree = new FugueTree<string>();
  const nodes = await getDocument();
  const nodesMap = new Map(Object.entries(nodes));
  tree.setTree(nodesMap);
  return tree;
}

async function getTree(): Promise<Record<string, Node<string>[]>> {
  const tree = await getTreeInstance();
  return Object.fromEntries(tree.nodes);
}

function deleteTree(): void {
  // TODO: Implement this function
}

async function insertCharacter({ id, value, parent, side }: InsertMessage<string>) {
  const tree = await getTreeInstance();
  tree.addNode(id, value, parent, side);
  await setDocument(Object.fromEntries(tree.nodes));
}

async function deleteCharacter({ id }: DeleteMessage) {
  const tree = await getTreeInstance();
  tree.deleteNode(id);
  await setDocument(Object.fromEntries(tree.nodes));
}

export default {
  getTree,
  deleteTree,
  insertCharacter,
  deleteCharacter,
};
