import onOperation from '@controllers/websocket/document/onOperation';
import onCursorChange from '@controllers/websocket/document/onCursorChange';
import { DocumentService, SocketHandler } from '@src/types';
import onHistoryOperation from '@controllers/websocket/document/onHistoryOperation';
import onTitleChange from '@controllers/websocket/document/onTitleChange';

export default function events(service: DocumentService): Record<string, SocketHandler> {
  if (!service) {
    throw new Error('Service parameter is required');
  }
  return {
    operation: onOperation(service),
    cursorChange: onCursorChange(),
    historyOperation: onHistoryOperation(),
    titleChange: onTitleChange(service),
  };
}
