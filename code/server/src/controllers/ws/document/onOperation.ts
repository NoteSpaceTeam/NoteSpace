import { Socket } from 'socket.io';
import { DocumentService } from '@src/types';
import { Operation } from '@notespace/shared/crdt/types/operations';

function onOperation(service: DocumentService) {
  return (socket: Socket, operations: Operation[]) => {
    for (const operation of operations) {
      console.log('operation', operation);
      switch (operation.type) {
        case 'insert':
          service.insertCharacter(operation);
          break;
        case 'delete':
          service.deleteCharacter(operation);
          break;
        case 'inline-style':
          service.updateInlineStyle(operation);
          break;
        case 'block-style':
          service.updateBlockStyle(operation);
          break;
        default:
          throw new Error('Invalid operation type');
      }
    }
    socket.broadcast.emit('operation', operations);
  };
}

export default onOperation;
