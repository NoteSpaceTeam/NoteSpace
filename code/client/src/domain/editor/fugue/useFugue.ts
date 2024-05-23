import { useMemo } from 'react';
import { Fugue } from '@domain/editor/fugue/fugue';

const useFugue = () => useMemo(() => new Fugue(), []);

export default useFugue;
