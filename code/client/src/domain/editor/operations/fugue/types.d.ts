import { Operation } from '@notespace/shared/document/types/operations';

export type FugueDomainOperations = {
  applyOperations: (operations: Operation[]) => void;
};
