import { Socket } from 'socket.io';
import { DocumentService } from '@src/types';
import { Operation } from '@notespace/shared/crdt/types/operations';

function onOperation(service: DocumentService) {
  return async (socket: Socket, operations: Operation[]) => {
    if (!operations) return;
    console.log('Operation:', operations);
    for (const operation of operations) {
      switch (operation.type) {
        case 'insert':
          await service.insertCharacter(operation);
          break;
        case 'delete':
          await service.deleteCharacter(operation);
          break;
        case 'inline-style':
          await service.updateInlineStyle(operation);
          break;
        case 'block-style':
          await service.updateBlockStyle(operation);
          break;
        case 'revive':
          await service.reviveLocal(operation);
          break;
        default:
          throw new Error('Invalid operation type');
      }
    }
    socket.emit('ack');
    socket.broadcast.emit('operation', operations);
  };
}

export default onOperation;
