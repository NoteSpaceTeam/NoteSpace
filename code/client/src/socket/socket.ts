import { io } from 'socket.io-client';
import config from '@src/config';
import { chunkData } from '@editor/crdt/utils';

export const socket = io(config.SOCKET_SERVER_URL);

export const emitChunked = (event: string, data: any, chunkSize : number) =>
  chunkData(data, chunkSize).forEach((chunk) => socket.emit(event, chunk));

export const singleEmit = (event: string, data: any) => socket.emit(event, data);
