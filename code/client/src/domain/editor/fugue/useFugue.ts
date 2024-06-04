import { useMemo } from 'react';
import { Fugue } from '@domain/editor/fugue/Fugue';

const useFugue = () => useMemo(() => new Fugue(), []);

export default useFugue;
