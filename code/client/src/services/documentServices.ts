import { HttpCommunication } from '@/services/communication/http/httpCommunication';
import { DocumentResource } from '@notespace/shared/src/workspace/types/resource.ts';

async function getDocument(http: HttpCommunication, id: string): Promise<DocumentResource> {
  return await http.get(`/documents/${id}`);
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
