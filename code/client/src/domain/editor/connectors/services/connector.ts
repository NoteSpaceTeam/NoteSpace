import { Communication } from '@services/communication/communication';
import { Fugue } from '@domain/editor/fugue/Fugue';
import { Operation } from '@notespace/shared/src/document/types/operations';
import { InlineStyle } from '@notespace/shared/src/document/types/styles';
import { BaseSelection } from 'slate';
import { SocketEventHandlers } from '@services/communication/socket/socketCommunication';
export type ServiceConnector = {
  communication: Communication;
  applyFugueOperations: (operations: Operation[]) => void;
  emitOperations: (operations: Operation[]) => void;
  emitCursorChange({ range, styles }: { range: BaseSelection; styles: InlineStyle[] }): void;
  appendEvent(name: string, handler: (...args: any[]) => void): void;
  getEvents(): SocketEventHandlers;
};

export default (fugue: Fugue, communication: Communication) => {
  const events: SocketEventHandlers = {};

  // Operations
  function applyFugueOperations(operations: Operation[]) {
    fugue.applyOperations(operations);
  }

  // Socket
  function emitOperations(operations: Operation[]) {
    communication.socket.emit('operations', operations);
  }
  function emitCursorChange({ range, styles }: { range: BaseSelection; styles: InlineStyle[] }) {
    communication.socket.emit('cursorChange', { range, styles });
  }
  function appendEvent(name: string, handler: (...args: any[]) => void) {
    events[name] = handler;
  }
  function getEvents() {
    return events;
  }

  // HTTP
  // ...

  return {
    communication,
    applyFugueOperations,
    emitOperations,
    emitCursorChange,
    appendEvent,
    getEvents,
  };
};
