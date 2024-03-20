import { DeleteMessage, InsertMessage, Node } from '@shared/dist/crdt/types';

type Database = {
  getTree: () => Promise<Record<string, Node[]>>;
  deleteTree: () => void;
  insertCharacter: (msg: InsertMessage<string>) => void;
  deleteCharacter: (msg: DeleteMessage) => void;
};

type Service = {
  getTree: () => Promise<Record<string, Node[]>>;
  deleteTree: () => void;
  insertCharacter: (msg: InsertMessage) => void;
  deleteCharacter: (msg: DeleteMessage) => void;
};
