import { Fugue } from '@editor/crdt/Fugue';
import { useMemo } from 'react';

export default () => useMemo(() => new Fugue(), []);
