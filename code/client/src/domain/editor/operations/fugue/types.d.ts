import { Operation } from '@notespace/shared/src/document/types/operations.ts';

export type FugueDomainOperations = {
  applyOperations: (operations: Operation[]) => void;
};
