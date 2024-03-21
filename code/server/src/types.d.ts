import { Nodes } from '@notespace/shared/crdt/types';
import { InsertOperation, DeleteOperation, StyleOperation } from '@notespace/shared/crdt/operations';

type Database = {
  getTree: () => Promise<Nodes<string>>;
  deleteTree: () => void;
  insertCharacter: (operation: InsertOperation<string>) => void;
  deleteCharacter: (operation: DeleteOperation) => void;
  updateStyle: (operation: StyleOperation) => void;
};

type Service = {
  getTree: () => Promise<Nodes<string>>;
  deleteTree: () => void;
  insertCharacter: (operation: InsertOperation) => void;
  deleteCharacter: (operation: DeleteOperation) => void;
  updateStyle: (operation: StyleOperation) => void;
};
