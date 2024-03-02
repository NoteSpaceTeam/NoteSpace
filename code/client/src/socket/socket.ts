import { io } from 'socket.io-client';

const url = 'ws://localhost:8080';
export const socket = io(url);