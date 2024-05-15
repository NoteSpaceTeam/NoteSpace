import { socketCommunication, SocketCommunication } from '@services/communication/socket/socketCommunication';
import { httpCommunication, HttpCommunication } from '@services/communication/http/httpCommunication';

export interface Communication {
  socket: SocketCommunication;
  http: HttpCommunication;
}

export const communication: Communication = {
  socket: socketCommunication,
  http: httpCommunication,
};
