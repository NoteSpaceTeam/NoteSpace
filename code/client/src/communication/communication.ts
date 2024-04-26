import { socketCommunication, SocketCommunication } from '@src/communication/socket/ws.ts';
import { httpCommunication, HttpCommunication } from '@src/communication/http/http.ts';

export type Communication = {
  socket: SocketCommunication;
  http: HttpCommunication;
};

export const communication: Communication = {
  socket: socketCommunication,
  http: httpCommunication,
};
