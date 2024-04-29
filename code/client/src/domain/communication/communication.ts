import { socketCommunication, SocketCommunication } from '@/domain/communication/socket/socketCommunication.ts';
import { httpCommunication, HttpCommunication } from '@/domain/communication/http/httpCommunication.ts';

export interface Communication {
  socket: SocketCommunication;
  http: HttpCommunication;
}

export const communication: Communication = {
  socket: socketCommunication,
  http: httpCommunication,
};
