import { io, Socket } from 'socket.io-client';
import config from '@/config.ts';
import documentNamespace from '@/services/communication/socket/namespaces/documentNamespace.ts';

export function namespace(namespace: string) {
  const OPTIONS = { autoConnect: true };
  return io(config.SOCKET_SERVER_URL + namespace, OPTIONS);
}

export default {
  '/document': documentNamespace,
  '/workspace': namespace('/workspace'),
  '/user': namespace('/user'),
} as Record<string, Socket>;
