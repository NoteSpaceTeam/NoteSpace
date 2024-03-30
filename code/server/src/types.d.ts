import { Nodes } from '@notespace/shared/crdt/types';
import {
  InsertOperation,
  DeleteOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';
import { Socket } from 'socket.io';

type DocumentDatabase = {
  getTree: () => Promise<Nodes<string>>;
  deleteTree: () => void;
  insertCharacter: (operation: InsertOperation<string>) => void;
  deleteCharacter: (operation: DeleteOperation) => void;
  updateInlineStyle: (operation: InlineStyleOperation) => void;
  updateBlockStyle: (operation: BlockStyleOperation) => void;
};

type DocumentService = {
  getTree: () => Promise<Nodes<string>>;
  deleteTree: () => void;
  insertCharacter: (operation: InsertOperation) => void;
  deleteCharacter: (operation: DeleteOperation) => void;
  updateInlineStyle: (operation: InlineStyleOperation) => void;
  updateBlockStyle: (operation: BlockStyleOperation) => void;
};

type SocketHandler = (socket: Socket, data: any) => void;
