import { io, ManagerOptions, SocketOptions } from 'socket.io-client';

const SOCKET_SERVER_URL = 'ws://localhost:8080';
const socketConfig: Partial<ManagerOptions & SocketOptions> = {};
export const socket = io(SOCKET_SERVER_URL, socketConfig);
