import { Socket } from 'socket.io';

function onHistoryOperation() {
  return function (socket: Socket, operation: any) {
    socket.broadcast.emit('historyOperation', operation);
  };
}

export default onHistoryOperation;
