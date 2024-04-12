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
  chunkData(data, chunkSize).forEach(chunk => socket.emit(event, chunk));


/**
 * Breaks the given data into chunks of the given size.
 * Useful for breaking large data into smaller chunks for network transmission
 * @param data
 * @param chunkSize
 * @returns the data chunks
 */
export function chunkData<T>(data: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  range(0, data.length, chunkSize).forEach(i => {
    chunks.push(data.slice(i, i + chunkSize));
  });
  return chunks;
}