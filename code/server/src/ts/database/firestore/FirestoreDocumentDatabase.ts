import { DocumentContent } from '@notespace/shared/src/workspace/types/document';
import { NotFoundError } from '@domain/errors/errors';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { firestore } from 'firebase-admin';
import FieldValue = firestore.FieldValue;
import { DocumentRepository } from '@database/types';
import CollectionReference = firestore.CollectionReference;
import db from '@database/firestore/config';

export class FirestoreDocumentDatabase implements DocumentRepository {
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

  private async getDoc(wid: string, id: string) {
    const documents = await this.getWorkspace(wid);
    const query = documents.where('id', '==', id);
    const data = await query.get();
    if (data.empty) throw new NotFoundError(`Document with id ${id} not found`);
    return data.docs[0].ref;
  }
}
