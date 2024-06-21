import { useMemo } from 'react';
import { useCommunication } from '@/contexts/communication/useCommunication';
import { useParams } from 'react-router-dom';
import resourceService from '@services/resource/resourceService';

function useResourceService() {
  const { http } = useCommunication();
  const { wid } = useParams();
  if (!wid) throw new Error('Cannot use document services outside of a workspace');
  return useMemo(() => resourceService(http, wid), [http, wid]);
}

export default useResourceService;
