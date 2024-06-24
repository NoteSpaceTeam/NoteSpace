import { useMemo } from 'react';
import { useCommunication } from '@/contexts/communication/useCommunication';
import { useParams } from 'react-router-dom';
import commitsService from '@services/commits/commitsService';
import useError from '@/contexts/error/useError';

function useCommitsService() {
  const { http } = useCommunication();
  const { wid, id } = useParams();
  const { errorHandler } = useError();
  if (!wid || !id) throw new Error('Cannot use commits service outside of a document');
  return useMemo(() => commitsService(http, errorHandler, wid, id), [http, errorHandler, wid, id]);
}

export default useCommitsService;
