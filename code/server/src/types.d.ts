type Database = {
  getTree: <T>() => TreeData<T>;
  deleteTree: () => void;
  insertCharacter: <T>(msg: InsertMessage<T>) => void;
  deleteCharacter: (msg: DeleteMessage) => void;
};

type Service = {
  getTree: <T>() => TreeData<T>;
  deleteTree: () => void;
  insertCharacter: <T>(msg: InsertMessage<T>) => void;
  deleteCharacter: (msg: DeleteMessage) => void;
};

type Id = {
  sender: string;
  counter: number;
};

type InsertMessage<T> = {
  type: 'insert';
  id: Id;
  value: T;
  parent: Id;
  side: 'L' | 'R';
};

type DeleteMessage = {
  type: 'delete';
  id: Id;
};

type TreeData<T> = {
  root: Node<T>;
  // nodes: Record<string, Node<T>[]>;
};
