import { Socket } from 'socket.io';
import { Operation } from '@notespace/shared/src/document/types/operations';

import { ForbiddenError, InvalidParameterError } from '@domain/errors/errors';
import { DocumentsService } from '@services/DocumentsService';
import rooms from '@controllers/ws/rooms/rooms';

function onOperation(service: DocumentsService) {
  return async (socket: Socket, operations: Operation[]) => {
    if (!operations) throw new InvalidParameterError('Operations are required');

    const { id, wid } = rooms.documents.get(socket.id);
    if (!id) throw new ForbiddenError('Not in a room');

    socket.broadcast.to(id).emit('operations', operations);
    await service.applyOperations(wid, id, operations);
    socket.emit('ack');
  };
}

export default onOperation;
