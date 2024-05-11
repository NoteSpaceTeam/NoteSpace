import { SocketHandler } from '@controllers/ws/types';
import { DocumentsService } from '@services/DocumentsService';
import onOperation from '@controllers/ws/events/document/onOperation';
import onCursorChange from '@controllers/ws/events/document/onCursorChange';
import onJoinDocument from '@controllers/ws/events/document/onJoinDocument';
import onLeaveDocument from '@controllers/ws/events/document/onLeaveDocument';
import onJoinWorkspace from '@controllers/ws/events/workspace/onJoinWorkspace';
import onLeaveWorkspace from '@controllers/ws/events/workspace/onLeaveWorkspace';

export default function events(service: DocumentsService): Record<string, SocketHandler> {
  if (!service) throw new Error('Service parameter is required');

  return {
    // document events
    operation: onOperation(service),
    cursorChange: onCursorChange(),
    joinDocument: onJoinDocument(),
    leaveDocument: onLeaveDocument(),

    // workspace events
    joinWorkspace: onJoinWorkspace(),
    leaveWorkspace: onLeaveWorkspace(),
  };
}
