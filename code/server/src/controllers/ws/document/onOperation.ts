import { Socket } from 'socket.io';
import { DocumentService } from '@src/types';
import { Operation } from '@notespace/shared/crdt/types/operations';
import { getRoomId } from '@controllers/ws/rooms';
import { ForbiddenError, InvalidParameterError } from '@domain/errors/errors';

function onOperation(service: DocumentService) {
  return async (socket: Socket, operations: Operation[]) => {
    if (!operations) {
      throw new InvalidParameterError('Operations are required');
    }
    const documentId = getRoomId(socket);
    if (!documentId) {
      throw new ForbiddenError('Client socket not in a room');
    }
    socket.broadcast.to(documentId).emit('operation', operations);
    await service.applyOperations(documentId, operations);
    socket.emit('ack');
  };
}

export default onOperation;
