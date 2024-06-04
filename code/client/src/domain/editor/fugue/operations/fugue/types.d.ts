import { Operation } from '@notespace/shared/src/document/types/operations';

export type FugueDomainOperations = {
  applyOperations: (operations: Operation[]) => void;
};
