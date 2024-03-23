import onOperation from '@src/controllers/socket/document/onOperation';
import onCursorChange from '@src/controllers/socket/document/onCursorChange';
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
