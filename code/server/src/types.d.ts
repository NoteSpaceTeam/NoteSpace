import { Socket } from 'socket.io';
import { Document } from '@notespace/shared/crdt/types/document';
import {
  InsertOperation,
  DeleteOperation,
  InlineStyleOperation,
  BlockStyleOperation, ReviveOperation,
} from '@notespace/shared/crdt/types/operations';

type DocumentDatabase = {
  getDocument: () => Promise<Document>;
  updateDocument: (nodes: Nodes<string>) => Promise<void>;
  updateTitle: (title: string) => Promise<void>;
  deleteDocument: () => Promise<void>;
};

type DocumentService = {
  getDocument: () => Promise<Document>;
  deleteDocument: () => void;
  insertCharacter: (operation: InsertOperation) => Promise<void>;
  deleteCharacter: (operation: DeleteOperation) => Promise<void>;
  updateInlineStyle: (operation: InlineStyleOperation) => Promise<void>;
  updateBlockStyle: (operation: BlockStyleOperation) => Promise<void>;
  reviveLocal: (operation: ReviveOperation) => Promise<void>;
  updateTitle: (title: string) => Promise<void>;
};

type SocketHandler = (socket: Socket, data: any) => Promise<void> | void;
