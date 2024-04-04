import { Nodes } from "./nodes";

export type Document = {
  title: string;
  nodes: Nodes<string>;
};
