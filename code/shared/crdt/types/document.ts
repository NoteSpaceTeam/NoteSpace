import { Nodes } from "./nodes";

export type Document = {
  id: string;
  title: string;
  nodes: Nodes<string>;
};
