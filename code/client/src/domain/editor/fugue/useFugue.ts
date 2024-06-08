import { useMemo } from 'react';
import { Fugue } from '@domain/editor/fugue/Fugue';
import { useParams } from 'react-router-dom';

function useFugue() {
  const { id } = useParams();
  // reset fugue when navigating between documents
  return useMemo(() => new Fugue(), [id]); // eslint-disable-line
}

export default useFugue;
