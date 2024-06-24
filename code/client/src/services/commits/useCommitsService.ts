import { useMemo } from 'react';
import { useCommunication } from '@/contexts/communication/useCommunication';
import { useParams } from 'react-router-dom';
import commitsService from '@services/commits/commitsService';

function useCommitsService() {
  const { http } = useCommunication();
  const { wid, id } = useParams();
  if (!wid || !id) throw new Error('Cannot use commits service outside of a document');
  return useMemo(() => commitsService(http, wid, id), [http, wid, id]);
}

export default useCommitsService;
