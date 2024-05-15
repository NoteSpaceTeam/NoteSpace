import { io } from 'socket.io-client';
import config from '@/config.ts';
import { OperationEmitter } from '@services/communication/socket/operationEmitter.ts';

type EmitType = (event: string, data?: any) => void;
type ListenType = (eventHandlers: SocketEventHandlers) => void;
type ConnectionType = () => void;
export type SocketEventHandlers = Record<string, (...args: any[]) => void>;

export interface SocketCommunication {
  emit: EmitType;
  on: ListenType;
  off: ListenType;
  connect: ConnectionType;
  disconnect: ConnectionType;
}

const socket = io(config.SOCKET_SERVER_URL);
const OPERATION_DELAY = 100;
const operationEmitter = new OperationEmitter(socket, OPERATION_DELAY);

function emit(event: string, data: any) {
  switch (event) {
    case 'operations':
      operationEmitter.addOperation(...data);
      break;
    case 'cursorChange':
      setTimeout(() => socket.emit(event, data), OPERATION_DELAY);
      break;
    default:
      socket.emit(event, data);
      break;
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
