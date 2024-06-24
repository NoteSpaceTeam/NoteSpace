import { useMemo } from 'react';
import { useCommunication } from '@/contexts/communication/useCommunication';
import workspaceService from '@services/workspace/workspaceService';
import useError from '@/contexts/error/useError';

function useWorkspaceService() {
  const { http } = useCommunication();
  const { errorHandler } = useError();
  return useMemo(() => workspaceService(http, errorHandler), [http, errorHandler]);
}

export default useWorkspaceService;
