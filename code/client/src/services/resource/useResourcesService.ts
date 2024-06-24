import { useMemo } from 'react';
import { useCommunication } from '@/contexts/communication/useCommunication';
import { useParams } from 'react-router-dom';
import resourcesService from '@services/resource/resourcesService';
import useError from '@/contexts/error/useError';

function useResourcesService() {
  const { http } = useCommunication();
  const { wid } = useParams();
  const { errorHandler } = useError();
  if (!wid) throw new Error('Cannot use document service outside of a workspace');
  return useMemo(() => resourcesService(http, errorHandler, wid), [http, errorHandler, wid]);
}

export default useResourcesService;
