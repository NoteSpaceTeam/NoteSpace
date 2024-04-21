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

socket.emitChunked = (event: string, data: any[], chunkSize: number = CHUNK_DATA_SIZE) => {
  const chunks: any[] = range(0, data.length, chunkSize).map(start => data.slice(start, start + chunkSize));
  let chunkIndex = 0;

  const onAcknowledge = () => {
    if (chunkIndex < chunks.length) {
      socket.emit(event, chunks[chunkIndex++]);
    } else {
      socket.off('ack', onAcknowledge);
    }
  };
  socket.emit(event, chunks[chunkIndex++]);
  socket.on('ack', onAcknowledge);
};
