import { HttpCommunication } from '@domain/communication/http/httpCommunication';
import documentServices from '@/services/documentServices';
import { useMemo } from 'react';

function useDocumentServices(http: HttpCommunication) {
  return useMemo(
    () => ({
      getDocument: (id: string) => documentServices.getDocument(http, id),
      createDocument: () => documentServices.createDocument(http),
      deleteDocument: (id: string) => documentServices.deleteDocument(http, id),
    }),
    [http]
  );
}

export default useDocumentServices;
