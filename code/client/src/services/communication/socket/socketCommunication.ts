import namespaces from '@/services/communication/socket/namespaces/namespaces.ts';
import { io } from 'socket.io-client';
import config from '@/config.ts';

type EmitType = (event: string, data?: any) => void;
type ListenType = (eventHandlers: SocketEventHandlers) => void;
type ConnectionType = (namespace: string) => void;
export type SocketEventHandlers = Record<string, (...args: any[]) => void>;

io(config.SOCKET_SERVER_URL);

export interface SocketCommunication {
  emit: EmitType;
  on: ListenType;
  off: ListenType;
  connect: ConnectionType;
  disconnect: ConnectionType;
}

function emit(str: string, data: any) {
  const [namespace, event] = str.split(':');
  if (!namespace || !event) throw new Error('Invalid event format');
  const socket = namespaces[`/${namespace}`];
  if (!socket) throw new Error('Invalid namespace');
  socket.emit(event, data);
}

function on(eventHandlers: SocketEventHandlers) {
  Object.entries(eventHandlers).forEach(([str, handler]) => {
    const [namespace, event] = str.split(':');
    if (!namespace || !event) throw new Error('Invalid event format');
    const socket = namespaces[`/${namespace}`];
    if (!socket) throw new Error('Invalid namespace:' + namespace);
    socket.on(event, handler);
  });
}

function off(eventHandlers: SocketEventHandlers) {
  Object.entries(eventHandlers).forEach(([str, handler]) => {
    const [namespace, event] = str.split(':');
    if (!namespace || !event) throw new Error('Invalid event format');
    const socket = namespaces[`/${namespace}`];
    if (!socket) throw new Error('Invalid namespace:' + namespace);
    socket.off(event, handler);
  });
}

function connect(namespace: string) {
  const socket = namespaces[namespace];
  if (!socket) throw new Error('Invalid namespace:' + namespace);
  socket.connect();
}

function disconnect(namespace: string) {
  const socket = namespaces[namespace];
  if (!socket) throw new Error('Invalid namespace:' + namespace);
  socket.disconnect();
}

export const socketCommunication: SocketCommunication = {
  emit,
  on,
  off,
  connect,
  disconnect,
};
