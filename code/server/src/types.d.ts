import { DeleteMessage, InsertMessage, Node } from 'shared/crdt/types';

type Database = {
  getTree: () => Record<string, Node[]>;
  deleteTree: () => void;
  insertCharacter: <T>(msg: InsertMessage<T>) => void;
  deleteCharacter: (msg: DeleteMessage) => void;
};

type Service = {
  getTree: () => Record<string, Node[]>;
  deleteTree: () => void;
  insertCharacter: (msg: InsertMessage) => void;
  deleteCharacter: (msg: DeleteMessage) => void;
};
