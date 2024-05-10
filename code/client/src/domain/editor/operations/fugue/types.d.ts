import { Operation } from '@notespace/shared/crdt/types/operations';

export type FugueDomainOperations = {
  applyOperations: (operations: Operation[]) => void;
};
