import { io } from 'socket.io-client';
import config from '@src/config';
import { range } from 'lodash';

const CHUNK_DATA_SIZE = 50;
export const socket = io(config.SOCKET_SERVER_URL);

declare module 'socket.io-client' {
  interface Socket {
    emitChunked: (event: string, data: any[], chunkSize?: number) => void;
  }
}

socket.emitChunked = (event: string, data: any[], chunkSize: number = CHUNK_DATA_SIZE) =>
  range(0, data.length, chunkSize).forEach(i => {
    const chunk = data.slice(i, i + chunkSize);
    socket.emit(event, chunk);
  });
