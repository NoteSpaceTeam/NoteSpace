import { Socket } from 'socket.io';
import { DocumentService } from '@controllers/ws/types';
import { getRoomId } from '@controllers/ws/rooms';
import { InvalidParameterError } from '@domain/errors/errors';

function title(service: DocumentService) {
  return async function (socket: Socket, title: string) {
    const documentId = getRoomId(socket);
    if (!documentId) throw new InvalidParameterError('Client not in document');

    await service.updateTitle(documentId, title);
    socket.broadcast.to(documentId).emit('title', title);
  };
}

export default title;
