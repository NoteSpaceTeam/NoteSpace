import { Socket } from 'socket.io';
import { Document, DocumentData, DocumentStorageData } from '@notespace/shared/crdt/types/document';
import { Operation } from '@notespace/shared/crdt/types/operations';

type DocumentDatabase = {
  getDocuments: () => Promise<DocumentData[]>;
  createDocument: () => Promise<string>;
  getDocument: (id: string) => Promise<DocumentStorageData>;
  deleteDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, operations: Operation[]) => Promise<void>;
  updateTitle: (id: string, title: string) => Promise<void>;
};

type DocumentService = {
  getDocuments: () => Promise<DocumentData[]>;
  createDocument: () => Promise<string>;
  getDocument: (id: string) => Promise<Document>;
  deleteDocument: (id: string) => void;
  updateDocument: (id: string, operations: Operation[]) => Promise<void>;
  updateTitle: (id: string, title: string) => Promise<void>;
};

type SocketHandler = (socket: Socket, data: any) => Promise<void> | void;
