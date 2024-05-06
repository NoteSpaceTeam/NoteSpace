import { HttpCommunication } from '@domain/communication/http/httpCommunication';
import documentServices from '@/services/documentServices';

function useDocumentServices(http: HttpCommunication) {
  async function getDocument(id: string) {
    return documentServices.getDocument(http, id);
  }

  async function createDocument() {
    return documentServices.createDocument(http);
  }

  async function deleteDocument(id: string) {
    return documentServices.deleteDocument(http, id);
  }

  return {
    getDocument,
    createDocument,
    deleteDocument,
  };
}

export default useDocumentServices;
