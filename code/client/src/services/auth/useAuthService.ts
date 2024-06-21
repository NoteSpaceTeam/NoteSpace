import { useMemo } from 'react';
import { useCommunication } from '@/contexts/communication/useCommunication';
import authService from '@services/auth/authService';

function useAuthService() {
  const { http } = useCommunication();
  return useMemo(() => authService(http), [http]);
}

export default useAuthService;