import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import serviceAccount from './firestore-key-5cddf-472039f8dbb6.json';
import { getFirestore } from 'firebase-admin/firestore';
import { DocumentContent } from '@notespace/shared/workspace/types/document';
import { NotFoundError } from '@domain/errors/errors';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { firestore } from 'firebase-admin';
import FieldValue = firestore.FieldValue;
import { DocumentDatabase } from '@database/types';
import CollectionReference = firestore.CollectionReference;

export default function DocumentFirestoreDB(): DocumentDatabase {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });

  const db = getFirestore();

  /**
   * Create a new document in firestore - all metadata is stored in postgres
   * @param workspace
   * @param id - the id of the document - must correspond to the id in postgres
   */
  async function createDocument(workspace: string, id: string) {
    const documents = await getWorkspace(workspace);

    const docData: DocumentContent = { operations: [] };
    await documents.doc(id).set(docData);
    return id;
  }

  /**
   * Get a document from firestore
   * @param workspace
   * @param id
   */
  async function getDocument(workspace: string, id: string): Promise<DocumentContent> {
    const doc = await getDoc(workspace, id);
    const snapshot = await doc.get();
    return snapshot.data() as DocumentContent;
  }

  async function deleteDocument(workspace: string, id: string) {
    const doc = await getDoc(workspace, id);
    await doc.delete();
  }

  async function updateDocument(workspace: string, id: string, newOperations: Operation[]) {
    const doc = await getDoc(workspace, id);
    await doc.update({ operations: FieldValue.arrayUnion(newOperations) });
  }

  async function getWorkspace(workspace: string): Promise<CollectionReference> {
    return db.collection(workspace);
  }

  async function getDoc(workspace: string, id: string) {
    const documents = await getWorkspace(workspace);

    const query = documents.where('id', '==', id);
    const data = await query.get();
    if (data.empty) throw new NotFoundError(`Document with id ${id} not found`);

    return data.docs[0].ref;
  }

  return {
    createDocument,
    getDocument,
    deleteDocument,
    updateDocument,
  };
}
