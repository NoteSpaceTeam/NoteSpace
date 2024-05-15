import { useMemo } from 'react';
import { useCommunication } from '@ui/contexts/communication/useCommunication.ts';
import workspaceService from '@services/workspace/workspaceService.ts';

function useWorkspaceService() {
  const { http } = useCommunication();
  return useMemo(() => workspaceService(http), [http]);
}

export default useWorkspaceService;
