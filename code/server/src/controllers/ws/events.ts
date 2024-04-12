import onOperation from '@controllers/ws/document/onOperation';
import onCursorChange from '@controllers/ws/document/onCursorChange';
import { DocumentService, SocketHandler } from '@src/types';
import onTitleChange from '@controllers/ws/document/onTitleChange';

export default function events(service: DocumentService): Record<string, SocketHandler> {
  if (!service) {
    throw new Error('Service parameter is required');
  }
  return {
    operation: onOperation(service),
    cursorChange: onCursorChange(),
    titleChange: onTitleChange(service),
  };
}
