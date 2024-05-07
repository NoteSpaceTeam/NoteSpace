import { Fugue } from '@domain/editor/crdt/fugue';
import { FugueDomainOperations } from '@domain/editor/operations/fugue/types';
import { Operation } from '@notespace/shared/crdt/types/operations';

export default (fugue: Fugue): FugueDomainOperations => {
  function applyOperations(operations: Operation[]) {
    return fugue.applyOperations(operations);
  }

  return {
    applyOperations,
  };
};
