import { Socket } from 'socket.io';
import { Document } from '@notespace/shared/crdt/types/document';
import {
  InsertOperation,
  DeleteOperation,
  InlineStyleOperation,
  BlockStyleOperation,
} from '@notespace/shared/crdt/types/operations';

type DocumentDatabase = {
  getDocument: () => Promise<Document>;
  deleteDocument: () => void;
  insertCharacter: (operation: InsertOperation) => void;
  deleteCharacter: (operation: DeleteOperation) => void;
  updateInlineStyle: (operation: InlineStyleOperation) => void;
  updateBlockStyle: (operation: BlockStyleOperation) => void;
  updateTitle: (title: string) => void;
};

type DocumentService = {
  getDocument: () => Promise<Document>;
  deleteDocument: () => void;
  insertCharacter: (operation: InsertOperation) => void;
  deleteCharacter: (operation: DeleteOperation) => void;
  updateInlineStyle: (operation: InlineStyleOperation) => void;
  updateBlockStyle: (operation: BlockStyleOperation) => void;
  updateTitle: (title: string) => void;
};

type SocketHandler = (socket: Socket, data: any) => void;
