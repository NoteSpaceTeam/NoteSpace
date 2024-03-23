import { Nodes } from '@notespace/shared/crdt/types';
import { InsertOperation, DeleteOperation, StyleOperation } from '@notespace/shared/crdt/operations';
import { Socket } from 'socket.io';

type DocumentDatabase = {
  getTree: () => Promise<Nodes<string>>;
  deleteTree: () => void;
  insertCharacter: (operation: InsertOperation<string>) => void;
  deleteCharacter: (operation: DeleteOperation) => void;
  updateStyle: (operation: StyleOperation) => void;
};

type DocumentService = {
  getTree: () => Promise<Nodes<string>>;
  deleteTree: () => void;
  insertCharacter: (operation: InsertOperation) => void;
  deleteCharacter: (operation: DeleteOperation) => void;
  updateStyle: (operation: StyleOperation) => void;
};

type SocketHandler = (socket: Socket, data: any) => void;
