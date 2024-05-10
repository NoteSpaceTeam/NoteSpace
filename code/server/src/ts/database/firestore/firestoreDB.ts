import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import serviceAccount from '@/firestore-key-5cddf-472039f8dbb6.json';
import { getFirestore } from 'firebase-admin/firestore';
import { DocumentContent } from '@notespace/shared/workspace/document';
import { NotFoundError } from '@domain/errors/errors';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { firestore } from 'firebase-admin';
import FieldValue = firestore.FieldValue;
import { DocumentDatabase } from '@database/types';
import CollectionReference = firestore.CollectionReference;
import Firestore = firestore.Firestore;

export class DocumentFirestoreDB implements DocumentDatabase {
  private readonly db: Firestore;
  constructor() {
    initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    });
    this.db = getFirestore();
  }

  async createDocument(workspace: string, id: string) {
    const documents = await this.getWorkspace(workspace);

    const docData: DocumentContent = { operations: [] };
    await documents.doc(id).set(docData);
    return id;
  }

  async getDocument(workspace: string, id: string): Promise<DocumentContent> {
    const doc = await this.getDoc(workspace, id);
    const snapshot = await doc.get();
    return snapshot.data() as DocumentContent;
  }

  async deleteDocument(workspace: string, id: string) {
    const doc = await this.getDoc(workspace, id);
    await doc.delete();
  }

  async updateDocument(workspace: string, id: string, newOperations: Operation[]) {
    const doc = await this.getDoc(workspace, id);
    await doc.update({ operations: FieldValue.arrayUnion(newOperations) });
  }

  async getWorkspace(workspace: string): Promise<CollectionReference> {
    return this.db.collection(workspace);
  }

  async getDoc(workspace: string, id: string) {
    const documents = await this.getWorkspace(workspace);

    const query = documents.where('id', '==', id);
    const data = await query.get();
    if (data.empty) throw new NotFoundError(`Document with id ${id} not found`);

    return data.docs[0].ref;
  }
}
