import { io, Socket } from 'socket.io-client';
import config from '@/config';
import { OperationEmitter } from '@/domain/communication/socket/operationEmitter';

type EmitType = (event: string, data?: any) => void;
type ListenType = (eventHandlers: SocketEventHandlers) => void;
export type SocketEventHandlers = Record<string, (...args: any[]) => void>;

const OPTIONS = { autoConnect: false };
export const socket: Socket = io(config.SOCKET_SERVER_URL, OPTIONS);
const operationEmitter = new OperationEmitter();

export interface SocketCommunication {
  emit: EmitType;
  on: ListenType;
  off: ListenType;
  connect: () => void;
  disconnect: () => void;
}

function emit(event: string, data: any) {
  if (event === 'operation') {
    operationEmitter.addOperation(...data);
  } else {
    socket.emit(event, data);
  }
}

function on(eventHandlers: SocketEventHandlers) {
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    socket.on(event, handler);
  });
}

function off(eventHandlers: SocketEventHandlers) {
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
  on,
  off,
  connect,
  disconnect,
};
