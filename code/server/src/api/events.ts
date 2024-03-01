import { Socket } from 'socket.io';

type OperationData = {
  type: 'insert' | 'delete';
  character: string;
};

export default function events(database: Database) {
  function onOperation(socket: Socket, data: OperationData) {
    if (!data.character) throw new Error('Invalid character: ' + data.character);
    switch (data.type) {
      case 'insert': {
        database.insertCharacter(data.character);
        socket.broadcast.emit('operation', data);
        break;
      }
      case 'delete': {
        database.deleteCharacter(data.character);
        socket.broadcast.emit('operation', data);
        break;
      }
      default:
        throw new Error('Invalid operation type');
    }
  }

  return {
    operation: onOperation,
  };
}
