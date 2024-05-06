import { DocumentService, SocketHandler } from '@src/types';
import onOperation from '@controllers/ws/document/onOperation';
import onCursorChange from '@controllers/ws/document/onCursorChange';
import onTitleChange from '@controllers/ws/document/onTitleChange';
import onJoinDocument from '@controllers/ws/document/onJoinDocument';
import onLeaveDocument from '@controllers/ws/document/onLeaveDocument';

export default function events(service: DocumentService): Record<string, SocketHandler> {
  if (!service) throw new Error('Service parameter is required');

  return {
    operation: onOperation(service),
    cursorChange: onCursorChange(),
    titleChange: onTitleChange(service),
    joinDocument: onJoinDocument(),
    leaveDocument: onLeaveDocument(),
  };
}
