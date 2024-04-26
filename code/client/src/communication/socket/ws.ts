import { socket } from '@src/communication/socket/socket.ts';

type EmitType = (event: string, data?: any) => void;
type ListenType = (eventHandlers: Record<string, (...args: any[]) => void>) => void;

export type SocketCommunication = {
  emit: EmitType;
  emitChunked: EmitType;
  on: ListenType;
  off: ListenType;
  connect: () => void;
  disconnect: () => void;
};

function emit(event: string, data: any) {
  socket.emit(event, data);
}

function emitChunked(event: string, data: any) {
  socket.emitChunked(event, data);
}

function on(eventHandlers: Record<string, (...args: any[]) => void>) {
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    socket.on(event, handler);
  });
}

function off(eventHandlers: Record<string, (...args: any[]) => void>) {
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    socket.off(event, handler);
  });
}

function connect() {
  socket.connect();
}

function disconnect() {
  socket.disconnect();
}

export const socketCommunication: SocketCommunication = {
  emit,
  emitChunked,
  on,
  off,
  connect,
  disconnect,
};
