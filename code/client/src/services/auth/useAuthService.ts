import { useMemo } from 'react';
import { useCommunication } from '@/contexts/communication/useCommunication';
import authService from '@services/auth/authService';
import useError from '@/contexts/error/useError';

function useAuthService() {
  const { http } = useCommunication();
  const { publishError } = useError();
  return useMemo(() => authService(http, publishError), [http, publishError]);
}

export default useAuthService;
