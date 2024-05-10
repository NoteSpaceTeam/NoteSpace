import { Operation } from "../crdt/types/operations";

export type DocumentContent = {
  operations: Operation[];
};
