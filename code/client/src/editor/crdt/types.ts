export type Id = {
  sender: string;
  counter: number;
};

export type Node<T> = {
  id: Id;
  value: T | null;
  isDeleted: boolean;
  parent: Id | null;
  side: 'L' | 'R';
  leftChildren: Id[];
  rightChildren: Id[];
  size: number;
};

export type InsertMessage<T> = {
  type: 'insert';
  id: Id;
  value: T;
  parent: Id;
  side: 'L' | 'R';
};

export type DeleteMessage = {
  type: 'delete';
  id: Id;
};
