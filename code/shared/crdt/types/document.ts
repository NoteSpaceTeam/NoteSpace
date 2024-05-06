import { Operation } from "./operations";

export type DocumentData = {
  id: string;
  title: string;
};

export type Document = DocumentData & {
  operations: Operation[];
};

export type DocumentStorageData = DocumentData & {
  operations: Operation[];
};
