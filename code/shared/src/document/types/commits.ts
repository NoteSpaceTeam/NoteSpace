import { Operation } from "./operations";

export type Commit = {
  id: string;
  content: string;
  timestamp: number;
  author: Author;
};

export type CommitMeta = Omit<Commit, "content">;

export type CommitData = Omit<Commit, "content"> & {
  content: Operation[];
};

export type Author = {
  id: string;
  name: string;
};
