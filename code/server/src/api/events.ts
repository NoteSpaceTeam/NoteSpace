import { Socket } from 'socket.io';

type OperationData = {
  type: 'insert' | 'delete' | 'enter';
  char?: string;
  index: number;
};

export default function events(database: Database) {
  function onOperation(socket: Socket, data: OperationData) {
    if (data.index < 0) throw new Error('Invalid index');
    if (data.char && data.char.length > 1) throw new Error('Invalid char');

    const db = database.getDocument();
    switch (data.type) {
      case 'insert': {
        const content = db.slice(0, data.index) + (data.char || '') + db.slice(data.index);
        database.updateDocument(content);
        socket.broadcast.emit('operation', data);
        break;
      }
      case 'delete': {
        const content = db.slice(0, data.index) + db.slice(data.index + 1);
        database.updateDocument(content);
        socket.broadcast.emit('operation', data);
        break;
      }
      case 'enter': {
        const content = db.slice(0, data.index) + '\n' + db.slice(data.index);
        database.updateDocument(content);
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
