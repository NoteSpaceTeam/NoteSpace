import { io } from 'socket.io-client';
import config from '@src/config';

const socket_url = config.SOCKET_SERVER_URL;

export const socket = io(socket_url);
