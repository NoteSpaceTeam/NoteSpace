import { useMemo } from 'react';
import { Fugue } from '@editor/crdt/fugue';

/**
 * A hook that returns a new replica of a FugueTree, as a FugueReplica.
 * @returns a new FugueReplica
 */
function useFugue() {
  return useMemo(() => new Fugue(), []);
}

export default useFugue;
