import { useMemo } from 'react';
import { Fugue } from '@/domain/editor/crdt/fugue.ts';

function useFugue() {
  return useMemo(() => new Fugue(), []);
}

export default useFugue;
