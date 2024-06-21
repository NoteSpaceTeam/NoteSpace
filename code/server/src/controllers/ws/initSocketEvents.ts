import { SocketHandler } from '@controllers/ws/types';
import { Socket } from 'socket.io';

import { ControllersLogger } from '@src/utils/logging';

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
      logger.logInfo('Client disconnected: ' + reason);
    });
  };
}
