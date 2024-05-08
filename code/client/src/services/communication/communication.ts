import { socketCommunication, SocketCommunication } from '@/services/communication/socket/socketCommunication.ts';
import { httpCommunication, HttpCommunication } from '@/services/communication/http/httpCommunication.ts';

export interface Communication {
  socket: SocketCommunication;
  http: HttpCommunication;
}

export const communication: Communication = {
  socket: socketCommunication,
  http: httpCommunication,
};
