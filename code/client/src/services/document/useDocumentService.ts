import documentService from '@/services/document/documentService.ts';
import { useMemo } from 'react';
import { useCommunication } from '@/services/communication/context/useCommunication.ts';
import { useParams } from 'react-router-dom';

function useDocumentService() {
  const { http } = useCommunication();
  const { wid } = useParams();
  if (!wid) throw new Error('Cannot use document services outside of a workspace');
  return useMemo(() => documentService(http, wid), [http, wid]);
}

export default useDocumentService;
