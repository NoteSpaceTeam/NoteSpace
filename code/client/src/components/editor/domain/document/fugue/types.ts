import { Operation } from '@notespace/shared/crdt/types/operations.ts';
import { Document } from '@notespace/shared/crdt/types/document.ts';

export type FugueDomainOperations = {
  applyOperations: (operations: Operation[]) => void;
  initDocument: (document: Document) => void;
};
