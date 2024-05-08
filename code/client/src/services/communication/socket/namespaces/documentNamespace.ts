import { Socket } from 'socket.io-client';
import { OperationEmitter } from '@/services/communication/socket/operationEmitter.ts';
import { namespace } from '@/services/communication/socket/namespaces/namespaces.ts';

const socket = namespace('/document');
const originalEmit = socket.emit;
const OPERATION_DELAY = 100;
const operationEmitter = new OperationEmitter(socket, OPERATION_DELAY);

// this is wrong, fix later
socket.emit = function (event: string, ...data: any[]): Socket {
  switch (event) {
    case 'operation':
      operationEmitter.addOperation(...data);
      break;
    case 'cursor':
      setTimeout(() => originalEmit.call(socket, event, ...data), OPERATION_DELAY);
      break;
    default:
      originalEmit.call(socket, event, ...data);
      break;
  }
  return socket;
};

export default socket;
