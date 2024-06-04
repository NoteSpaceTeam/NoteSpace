import { Fugue } from '@domain/editor/fugue/Fugue';
import { FugueDomainOperations } from '@domain/editor/operations/fugue/types';
import { Operation } from '@notespace/shared/src/document/types/operations';

export default (fugue: Fugue): FugueDomainOperations => {
  const applyOperations = (operations: Operation[]) => fugue.applyOperations(operations);

  return { applyOperations };
};
