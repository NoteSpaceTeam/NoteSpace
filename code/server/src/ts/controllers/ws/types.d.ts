import { Socket } from 'socket.io';

type SocketHandler = (socket: Socket, data: any) => Promise<void> | void;
type SocketNamespaces = Record<string, Record<string, SocketHandler>>;
