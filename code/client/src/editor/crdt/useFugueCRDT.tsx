import { useMemo } from 'react';
import { Fugue } from './fugue.ts';

function useFugueCRDT() {
  return useMemo(() => new Fugue(), []);
}

export default useFugueCRDT;
