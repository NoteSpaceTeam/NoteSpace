import { Fugue } from '@domain/editor/crdt/fugue';
import { FugueDomainOperations } from '@domain/editor/operations/fugue/types';

export default (fugue: Fugue): FugueDomainOperations => {
  return {
    applyOperations: operations => fugue.applyOperations(operations),
  };
};
