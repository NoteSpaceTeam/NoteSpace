import { HttpCommunication } from '@/services/communication/http/httpCommunication';
import { DocumentContent } from '@notespace/shared/workspace/document';

async function getDocument(http: HttpCommunication, id: string): Promise<DocumentContent> {
  const { operations, title } = await http.get(`/documents/${id}`);
  return { operations, title } as DocumentContent;
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
