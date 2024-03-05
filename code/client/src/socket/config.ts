import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

const SOCKET_SERVER_URL: string = 'http://localhost:8080';

const socketConfig: Partial<ManagerOptions & SocketOptions> = {};

export let socket: Socket | undefined = undefined;

export const getSocket = () => {
  if (socket) return socket;
  socket = io(SOCKET_SERVER_URL, socketConfig);
  return socket;
};
