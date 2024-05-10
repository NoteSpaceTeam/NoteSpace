import { Socket } from 'socket.io';
import { Operation } from '@notespace/shared/document/types/operations';

import { ForbiddenError, InvalidParameterError } from '@domain/errors/errors';
import { DocumentService } from '@services/DocumentService';
import rooms from '@controllers/ws/rooms/rooms';

function onOperation(service: DocumentService) {
  return async (socket: Socket, operations: Operation[]) => {
    if (!operations) throw new InvalidParameterError('Operations are required');

    const documentId = rooms.document.get(socket)?.id;
    if (!documentId) throw new ForbiddenError('Client socket not in a room');

    socket.broadcast.to(documentId).emit('operation', operations);
    await service.addOperations('documents', documentId, operations);
    socket.emit('ack');
  };
}

export default onOperation;
