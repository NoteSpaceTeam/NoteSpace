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
    for (const operation of operations) {
      switch (operation.type) {
        case 'insert':
          await service.insertCharacter(documentId, operation);
          break;
        case 'delete':
          await service.deleteCharacter(documentId, operation);
          break;
        case 'inline-style':
          await service.updateInlineStyle(documentId, operation);
          break;
        case 'block-style':
          await service.updateBlockStyle(documentId, operation);
          break;
        case 'revive':
          await service.reviveCharacter(documentId, operation);
          break;
        default:
          throw new InvalidParameterError('Invalid operation type');
      }
    }
    socket.emit('ack');
    socket.broadcast.to(documentId).emit('operation', operations);
  };
}

export default onOperation;
