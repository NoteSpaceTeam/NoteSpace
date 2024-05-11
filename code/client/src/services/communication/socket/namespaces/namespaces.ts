import { Socket } from 'socket.io-client';
import documentNamespace from '@/services/communication/socket/namespaces/documentNamespace.ts';
import { namespace } from '@/services/communication/socket/namespaces/utils.ts';

export default {
  '/document': documentNamespace,
  '/workspace': namespace('/workspace'),
  '/user': namespace('/user'),
} as Record<string, Socket>;
