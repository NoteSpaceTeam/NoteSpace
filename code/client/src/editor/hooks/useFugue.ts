import { useMemo } from 'react';
import { Fugue } from '../crdt/fugue.ts';

function useFugue() {
  return useMemo(() => new Fugue<string>(), []);
}

export default useFugue;
