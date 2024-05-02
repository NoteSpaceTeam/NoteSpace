import { Nodes } from "./nodes";
import { Operation } from "./operations";

export type DocumentData = {
  id: string;
  title: string;
};

export type Document = DocumentData & {
  nodes: Nodes<string>;
};

export type DocumentStorageData = DocumentData & {
  operations: Operation[];
};
