import { socketCommunication, SocketCommunication } from '@/domain/communication/socket/socketCommunication';
import { httpCommunication, HttpCommunication } from '@/domain/communication/http/httpCommunication';

export interface Communication {
  socket: SocketCommunication;
  http: HttpCommunication;
}

export const communication: Communication = {
  socket: socketCommunication,
  http: httpCommunication,
};
