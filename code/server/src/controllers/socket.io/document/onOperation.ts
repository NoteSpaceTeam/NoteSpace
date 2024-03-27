import { Socket } from 'socket.io';
import { DocumentService } from '@src/types';
import { Operation } from '@notespace/shared/crdt/types/operations';

function onOperation(service: DocumentService) {
  return (socket: Socket, operation: Operation) => {
    console.log('operation', operation);
    switch (operation.type) {
      case 'insert': {
        service.insertCharacter(operation);
        socket.broadcast.emit('operation', operation);
        break;
      }
      case 'delete': {
        service.deleteCharacter(operation);
        socket.broadcast.emit('operation', operation);
        break;
      }
      case 'style': {
        service.updateStyle(operation);
        socket.broadcast.emit('operation', operation);
        break;
      }
      default:
        throw new Error('Invalid operation type');
    }
  };
}

export default onOperation;
