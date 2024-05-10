import { useMemo } from 'react';
import { Fugue } from '@domain/editor/crdt/fugue';

const useFugue = () => useMemo(() => new Fugue(), []);

export default useFugue;
