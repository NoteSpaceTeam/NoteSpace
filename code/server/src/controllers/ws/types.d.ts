import { Socket } from 'socket.io';

type SocketHandler = (socket: Socket, data: any) => Promise<void> | void;
