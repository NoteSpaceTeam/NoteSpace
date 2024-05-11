import { DocumentContent } from '@notespace/shared/src/workspace/types/document';
import { NotFoundError } from '@domain/errors/errors';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { firestore } from 'firebase-admin';
import FieldValue = firestore.FieldValue;
import { DocumentsRepository } from '@databases/types';
import CollectionReference = firestore.CollectionReference;
import db from '@databases/documents/firestore/config';
import DocumentSnapshot = firestore.DocumentSnapshot;

export class FirestoreDocumentsDB implements DocumentsRepository {
  async createDocument(wid: string, id: string) {
    const documents = await this.getWorkspace(wid);
    const docData: DocumentContent = { operations: [] };
    await documents.doc(id).set(docData);
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
    await doc.update({ operations: FieldValue.arrayUnion(newOperations) });
  }

  async getWorkspace(id: string): Promise<CollectionReference> {
    return db.collection(id);
  }

  private async getDoc(wid: string, id: string): Promise<firestore.DocumentReference> {
    const documents = await this.getWorkspace(wid);
    const query = documents.where('id', '==', id);
    const data = await query.get();
    if (data.empty) throw new NotFoundError(`Document with id ${id} not found`);
    return data.docs[0].ref;
  }

  /**
   * Add a workspace (collection) in firestore
   * By adding a document with the id 'init' to the workspace collection, the workspace is created
   * @param wid
   */
  async addWorkspace(wid: string) {
    const workspace = db.collection(wid);
    await workspace.doc('init').set({ initialized: true });
  }

  /**
   * Remove a workspace (collection) in firestore
   * By deleting all the documents in the workspace collection, the workspace is removed
   * @param wid
   */
  async removeWorkspace(wid: string) {
    const workspace = db.collection(wid);
    const snapshot = await workspace.get();
    const batch = db.batch();
    snapshot.docs.forEach((doc: DocumentSnapshot) => batch.delete(doc.ref));
    await batch.commit();
  }
}
