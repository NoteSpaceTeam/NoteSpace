import { Fugue } from '@editor/crdt/fugue';
import { useMemo } from 'react';

export default () => useMemo(() => new Fugue(), []);
