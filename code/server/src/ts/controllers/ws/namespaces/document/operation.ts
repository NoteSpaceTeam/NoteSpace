import { Socket } from 'socket.io';

import { Operation } from '@notespace/shared/crdt/types/operations';

import { ForbiddenError, InvalidParameterError } from '@domain/errors/errors';
import { DocumentService } from '@services/documentService';

function operation(service: DocumentService) {
  return async (socket: Socket, operations: Operation[]) => {
    if (!operations) throw new InvalidParameterError('Operations are required');

    const documentId = getRoomId(socket);
    if (!documentId) throw new ForbiddenError('Client socket not in a room');

    socket.broadcast.to(documentId).emit('operation', operations);
    await service.updateDocument('documents', documentId, operations);
    socket.emit('ack');
  };
}

export default operation;
