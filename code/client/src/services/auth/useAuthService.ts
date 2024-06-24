import { useMemo } from 'react';
import { useCommunication } from '@/contexts/communication/useCommunication';
import authService from '@services/auth/authService';
import useError from '@/contexts/error/useError';

function useAuthService() {
  const { http } = useCommunication();
  const { errorHandler } = useError();
  return useMemo(() => authService(http, errorHandler), [http, errorHandler]);
}

export default useAuthService;
