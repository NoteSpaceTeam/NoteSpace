import { Socket } from 'socket.io';
import { Service } from '@src/types';
import { Operation } from '@notespace/shared/crdt/operations';

// type CursorChangeData = {
//   line: number;
//   column: number;
// };
//
// const cursorColorsMap = new Map<string, string>();

export default function events(service: Service) {
  function onOperation(socket: Socket, operation: Operation) {
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
  }

  // function onCursorChange(socket: Socket, position: CursorChangeData) {
  //   if (!cursorColorsMap.has(socket.id)) {
  //     const randomColor = 'hsl(' + Math.random() * 360 + ', 100%, 75%)';
  //     cursorColorsMap.set(socket.id, randomColor);
  //   }
  //   const color = cursorColorsMap.get(socket.id);
  //   socket.broadcast.emit('cursorChange', { position, id: socket.id, color });
  // }

  return {
    operation: onOperation,
    // cursorChange: onCursorChange,
  };
}
