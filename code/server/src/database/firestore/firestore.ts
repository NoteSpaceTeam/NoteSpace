import { Nodes } from '@notespace/shared/crdt/types/nodes';
import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import serviceAccount from '../../../firestore-key-5cddf-472039f8dbb6.json';
import { getFirestore } from 'firebase-admin/firestore';
import { emptyTree } from '@notespace/shared/crdt/utils';

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

const db = getFirestore();

export async function getNodes(): Promise<Nodes<string>> {
  const docRef = await db.collection('documents').doc('document').get();
  if (docRef.exists) {
    return docRef.data() as Nodes<string>;
  }
  const nodes: Nodes<string> = emptyTree();
  await updateNodes(nodes);
  return nodes;
}

export async function updateNodes(nodes: Nodes<string>) {
  const docRef = db.collection('documents').doc('document');
  await docRef.set(nodes);
}

export async function getTitle(): Promise<string> {
  return '';
}

export async function setTitle(title: string) {
  return;
}
