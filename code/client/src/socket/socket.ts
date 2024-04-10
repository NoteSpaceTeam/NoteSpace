import { io } from 'socket.io-client';
import config from '@src/config';
import { chunkData } from '@editor/crdt/utils';

export const socket = io(config.SOCKET_SERVER_URL);

const CHUNK_DATA_SIZE = 50;

declare module 'socket.io-client' {
  interface Socket {
    emitChunked: (event: string, data: any[], chunkSize?: number ) => void;
  }
}

socket.emitChunked = (event: string, data: any[], chunkSize: number = CHUNK_DATA_SIZE) =>
  chunkData(data, chunkSize).forEach(chunk => socket.emit(event, chunk));

