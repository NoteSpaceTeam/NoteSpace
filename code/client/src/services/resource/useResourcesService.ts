import { useMemo } from 'react';
import { useCommunication } from '@/contexts/communication/useCommunication';
import { useParams } from 'react-router-dom';
import resourcesService from '@services/resource/resourcesService';

function useResourcesService() {
  const { http } = useCommunication();
  const { wid } = useParams();
  if (!wid) throw new Error('Cannot use document service outside of a workspace');
  return useMemo(() => resourcesService(http, wid), [http, wid]);
}

export default useResourcesService;
