import { SocketHandler } from '@controllers/ws/types';
import { Socket } from 'socket.io';
import { ControllersLogger } from '@src/utils/logging';
import rooms from '@controllers/ws/rooms/rooms';
import onLeaveDocument from '@controllers/ws/events/document/onLeaveDocument';
import onLeaveWorkspace from '@controllers/ws/events/workspace/onLeaveWorkspace';

const logger = ControllersLogger('ws');

export default function initSocketEvents(events: Record<string, SocketHandler>) {
  return async (socket: Socket) => {
    logger.logInfo('Client connected:' + socket.id);

    // add listeners for each event
    Object.entries(events).forEach(([event, handler]) => {
      socket.on(event, async data => {
        try {
          logger.logInfo('Event: ' + event);
          await handler(socket, data);
        } catch (e: any) {
          logger.logError(e);
          socket.emit('error', e.message);
        }
      });
    });

    socket.on('disconnect', reason => {
      // check if the user is in a document room
      const isInDocument = rooms.document.isInRoom(socket.id);
      if (isInDocument) onLeaveDocument()(socket);
      // check if the user is in a workspace room
      const isInWorkspace = rooms.workspace.isInRoom(socket.id);
      if (isInWorkspace) onLeaveWorkspace()(socket);
      logger.logInfo('Client disconnected: ' + reason);
    });
  };
}
