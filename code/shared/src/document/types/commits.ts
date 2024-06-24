export type Commit = {
  id: string;
  content: string;
  timestamp: number;
  author: Author;
};

export type Author = {
  id: string;
  name: string;
};
