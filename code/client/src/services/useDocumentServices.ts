import documentServices from '@/services/documentServices';
import { useMemo } from 'react';
import { useCommunication } from '@/services/communication/context/useCommunication.ts';
import { useParams } from 'react-router-dom';

function useDocumentServices() {
  const { http } = useCommunication();
  const { wid } = useParams();
  if (!wid) throw new Error('Cannot use document services outside of a workspace');
  return useMemo(() => documentServices(http, wid), [http, wid]);
}

export default useDocumentServices;
