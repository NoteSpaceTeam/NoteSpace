import onOperation from '@controllers/socket.io/document/onOperation';
import onCursorChange from '@controllers/socket.io/document/onCursorChange';
import { DocumentService, SocketHandler } from '@src/types';

export default function events(service: DocumentService): Record<string, SocketHandler> {
  if (!service) {
    throw new Error('Service parameter is required');
  }
  return {
    operation: onOperation(service),
    cursorChange: onCursorChange,
  };
}
