import { useMemo } from 'react';
import { useCommunication } from '@/contexts/communication/useCommunication';
import { useParams } from 'react-router-dom';
import versionsService from '@services/versions/versionsService';

function useVersionsService() {
  const { http } = useCommunication();
  const { wid, id } = useParams();
  if (!wid || !id) throw new Error('Cannot use version service outside of a document');
  return useMemo(() => versionsService(http, wid, id), [http, wid, id]);
}

export default useVersionsService;
