import { Nodes, StyleOperation } from '@notespace/shared/crdt/types';

type Database = {
  getTree: () => Promise<Nodes<string>>;
  deleteTree: () => void;
  insertCharacter: (msg: InsertMessage<string>) => void;
  deleteCharacter: (msg: DeleteMessage) => void;
  updateStyle: (msg: StyleOperation) => void;
};

type Service = {
  getTree: () => Promise<Nodes<string>>;
  deleteTree: () => void;
  insertCharacter: (msg: InsertMessage) => void;
  deleteCharacter: (msg: DeleteMessage) => void;
  updateStyle: (msg: StyleOperation) => void;
};
