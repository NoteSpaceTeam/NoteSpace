import { Fugue } from '@src/editor/crdt/fugue';
import { useMemo } from 'react';

function useFugue() {
  return useMemo(() => new Fugue(), []);
}

export default useFugue;
