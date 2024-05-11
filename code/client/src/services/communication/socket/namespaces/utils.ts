import { io } from 'socket.io-client';
import config from '@/config.ts';

export function namespace(namespace: string) {
  const OPTIONS = { autoConnect: true };
  return io(config.SOCKET_SERVER_URL + namespace, OPTIONS);
}
