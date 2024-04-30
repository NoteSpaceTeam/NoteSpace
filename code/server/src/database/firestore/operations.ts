import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import serviceAccount from '@../../../firestore-key-5cddf-472039f8dbb6.json';
import { getFirestore } from 'firebase-admin/firestore';
import { emptyTree } from '@notespace/shared/crdt/utils';
import { DocumentDatabase } from '@src/types';
import { Document } from '@notespace/shared/crdt/types/document';
import { v4 as uuid } from 'uuid';
import { NotFoundError } from '@domain/errors/errors';

export default function DocumentFirestoreDatabase(): DocumentDatabase {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });

  const db = getFirestore();
  const documents = db.collection('documents');

  async function getDocuments() {
    const snapshot = await documents.get();
    return snapshot.docs.map(doc => doc.data() as Document);
  }

  async function createDocument() {
    const id = uuid();
    const docData: Document = {
      id,
      title: '',
      nodes: emptyTree(),
    };
    await documents.doc(id).set(docData);
    return id;
  }

  async function getDocument(id: string): Promise<Document> {
    const doc = await documents.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundError(`Document with id ${id} not found`);
    }
    return doc.data() as Document;
  }

  async function updateDocument(id: string, newDocument: Partial<Document>) {
    const doc = await documents.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundError(`Document with id ${id} not found`);
    }
    await documents.doc(id).update(newDocument);
  }

  async function deleteDocument(id: string) {
    const doc = await documents.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundError(`Document with id ${id} not found`);
    }
    await documents.doc(id).delete();
  }

  return {
    getDocuments,
    createDocument,
    getDocument,
    deleteDocument,
    updateDocument,
  };
}
