import { io } from 'socket.io-client';
import config from '@src/config';
import { chunkData } from '@editor/crdt/utils';

const CHUNK_DATA_SIZE = 50;
export const socket = io(config.SOCKET_SERVER_URL);

declare module 'socket.io-client' {
  interface Socket {
    emitChunked: (event: string, data: any[], chunkSize?: number) => void;
  }
}

socket.emitChunked = (event: string, data: any[], chunkSize: number = CHUNK_DATA_SIZE) =>
  chunkData(data, chunkSize).forEach(chunk => socket.emit(event, chunk));
