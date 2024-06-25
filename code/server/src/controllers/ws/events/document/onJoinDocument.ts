import { Socket } from 'socket.io';
import rooms from '@controllers/ws/rooms/rooms';
import { InvalidParameterError } from '@domain/errors/errors';

function onJoinDocument() {
  return function (socket: Socket, documentId: string) {
    if (!documentId) throw new InvalidParameterError('Document id is required');
    rooms.document.join(socket, documentId);
  };
}

export default onJoinDocument;
