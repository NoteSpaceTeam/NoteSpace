import { Operation } from "./operations";

export type Commit = {
  id: string;
  content: string;
  timestamp: number;
  author: Author;
};

export type CommitData = Omit<Commit, "content"> & {
  content: Operation[];
};

export type Author = {
  id: string;
  name: string;
};
