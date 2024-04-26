import { Socket } from 'socket.io';
import { Document } from '@notespace/shared/crdt/types/document';
import {
  InsertOperation,
  DeleteOperation,
  InlineStyleOperation,
  BlockStyleOperation,
  ReviveOperation,
} from '@notespace/shared/crdt/types/operations';

type DocumentDatabase = {
  createDocument: () => Promise<string>;
  getDocument: (id: string) => Promise<Document>;
  updateDocument: (id: string, document: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
};

type DocumentService = {
  createDocument: () => Promise<string>;
  getDocument: (id: string) => Promise<Document>;
  deleteDocument: (id: string) => void;
  insertCharacter: (id: string, operation: InsertOperation) => Promise<void>;
  deleteCharacter: (id: string, operation: DeleteOperation) => Promise<void>;
  updateInlineStyle: (id: string, operation: InlineStyleOperation) => Promise<void>;
  updateBlockStyle: (id: string, operation: BlockStyleOperation) => Promise<void>;
  reviveCharacter: (id: string, operation: ReviveOperation) => Promise<void>;
  updateTitle: (id: string, title: string) => Promise<void>;
};

type SocketHandler = (socket: Socket, data: any) => Promise<void> | void;
