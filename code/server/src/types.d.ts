import { Socket } from 'socket.io';
import { Document } from '@notespace/shared/crdt/types/document';
import { Operation } from '@notespace/shared/crdt/types/operations';

type DocumentDatabase = {
  getDocuments: () => Promise<Document[]>;
  createDocument: () => Promise<string>;
  getDocument: (id: string) => Promise<Document>;
  updateDocument: (id: string, document: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
};

type DocumentService = {
  getDocuments: () => Promise<Document[]>;
  createDocument: () => Promise<string>;
  getDocument: (id: string) => Promise<Document>;
  deleteDocument: (id: string) => void;
  updateTitle: (id: string, title: string) => Promise<void>;
  applyOperations: (id: string, operations: Operation[]) => Promise<void>;
};

type SocketHandler = (socket: Socket, data: any) => Promise<void> | void;
