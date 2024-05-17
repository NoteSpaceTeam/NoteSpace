import { SocketHandler } from '@controllers/ws/types';
import { Socket } from 'socket.io';

import { ServiceLogCaller } from '@src/utils/logging';
import getLogger, { ColorWrap, LogColor } from '@notespace/shared/src/utils/logging';

const logger = getLogger(ServiceLogCaller.Controllers + '-' + ColorWrap(LogColor.Red, 'ws'));

export default function initSocketEvents(events: Record<string, SocketHandler>) {
  // const onCursorChange = events['cursorChange'];
  return async (socket: Socket) => {
    logger.logInfo('Client connected:' + socket.id);

    Object.entries(events).forEach(([event, handler]) => {
      socket.on(event, async data => {
        try {
          logger.logInfo('Event: ' + event + '| Data: ' + JSON.stringify(data));
          await handler(socket, data);
        } catch (e: any) {
          logger.logError(e);
          socket.emit('error', e.message);
        }
      });
    });

    socket.on('disconnect', reason => {
      // onCursorChange(socket, null); // remove cursor
      logger.logInfo('Client disconnected: ' + reason);
    });
  };
}
