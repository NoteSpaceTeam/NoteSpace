import { useMemo } from 'react';
import { Fugue } from '@pages/editor/crdt/fugue.ts';

function useFugue() {
  return useMemo(() => new Fugue(), []);
}

export default useFugue;
