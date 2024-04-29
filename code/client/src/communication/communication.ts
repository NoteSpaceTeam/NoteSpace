import { socketCommunication, SocketCommunication } from '@communication/socket/socket-communication.ts';
import { httpCommunication, HttpCommunication } from '@communication/http/http.ts';

export interface Communication {
  socket: SocketCommunication;
  http: HttpCommunication;
}

export const communication: Communication = {
  socket: socketCommunication,
  http: httpCommunication,
};
