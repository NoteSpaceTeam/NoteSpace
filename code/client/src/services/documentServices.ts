import { HttpCommunication } from '@domain/communication/http/httpCommunication';
import { Document } from '@notespace/shared/crdt/types/document';

async function getDocument(http: HttpCommunication, id: string): Promise<Document> {
  const { nodes, title } = await http.get(`/documents/${id}`);
  return { nodes, title } as Document;
}

async function createDocument(http: HttpCommunication): Promise<string> {
  const { id } = await http.post('/documents');
  return id;
}

async function deleteDocument(http: HttpCommunication, id: string) {
  await http.delete(`/documents/${id}`);
}

export default {
  getDocument,
  createDocument,
  deleteDocument,
};
