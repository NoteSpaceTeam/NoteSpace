export type Id = {
  sender: string;
  counter: number;
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
