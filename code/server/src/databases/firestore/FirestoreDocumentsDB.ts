import { DocumentContent } from '@notespace/shared/src/workspace/types/document';
import { NotFoundError } from '@domain/errors/errors';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { firestore } from 'firebase-admin';
import FieldValue = firestore.FieldValue;
import { DocumentsRepository } from '@databases/types';
import CollectionReference = firestore.CollectionReference;
import db from '@databases/firestore/config';
import DocumentSnapshot = firestore.DocumentSnapshot;

export class FirestoreDocumentsDB implements DocumentsRepository {
  async createDocument(wid: string, id: string) {
    const documents = await this.getWorkspace(wid);
    const docData: DocumentContent = { operations: [] };

    const doc = documents.doc(id);

    await doc.set(docData);
    return id;
  }

  async getDocument(wid: string, id: string): Promise<DocumentContent> {
    const doc = await this.getDoc(wid, id);
    const snapshot = await doc.get();
    return snapshot.data() as DocumentContent;
  }

  async deleteDocument(wid: string, id: string) {
    const doc = await this.getDoc(wid, id);
    await doc.delete();
  }

  async updateDocument(wid: string, id: string, newOperations: Operation[]) {
    const doc = await this.getDoc(wid, id);
    await doc.update({ operations: FieldValue.arrayUnion(...newOperations) });
  }

  async getWorkspace(id: string): Promise<CollectionReference> {
    return db.collection(id);
  }

  private async getDoc(wid: string, id: string): Promise<firestore.DocumentReference> {
    const workspace = await this.getWorkspace(wid);
    const docRef = workspace.doc(id);

    const doc = await docRef.get();
    if (!doc.exists) throw new NotFoundError(`Document not found`);

    return docRef;
  }

  async addWorkspace(wid: string) {
    const workspace = db.collection(wid);
    const doc = workspace.doc('init');
    await doc.set({ initialized: true });
  }

  async removeWorkspace(wid: string) {
    const workspace = db.collection(wid);
    const snapshot = await workspace.get();
    const batch = db.batch();
    snapshot.docs.forEach((doc: DocumentSnapshot) => batch.delete(doc.ref));
    await batch.commit();
  }
}
