import { Operation } from '@notespace/shared/crdt/types/operations';
import { Document } from '@notespace/shared/crdt/types/document';

export type FugueHandlers = {
  applyOperations: (operations: Operation[]) => void;
  initDocument: (document: Document) => void;
};
