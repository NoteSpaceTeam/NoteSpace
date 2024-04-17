import { useMemo } from 'react';
import { Fugue } from '@editor/crdt/fugue';

function useFugue() {
  return useMemo(() => new Fugue(), []);
}

export default useFugue;
