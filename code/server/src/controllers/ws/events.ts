import { SocketHandler } from '@controllers/ws/types';
import onOperation from '@controllers/ws/events/document/onOperation';
import onCursorChange from '@controllers/ws/events/document/onCursorChange';
import onJoinDocument from '@controllers/ws/events/document/onJoinDocument';
import onLeaveDocument from '@controllers/ws/events/document/onLeaveDocument';
import onJoinWorkspace from '@controllers/ws/events/workspace/onJoinWorkspace';
import onLeaveWorkspace from '@controllers/ws/events/workspace/onLeaveWorkspace';
import { Services } from '@services/Services';

export default function events(services: Services): Record<string, SocketHandler> {
  if (!services) throw new Error('Services parameter is required');

  return {
    // document events
    operations: onOperation(services.documents),
    cursorChange: onCursorChange(),
    joinDocument: onJoinDocument(),
    leaveDocument: onLeaveDocument(),

    // workspace events
    joinWorkspace: onJoinWorkspace(services.workspaces),
    leaveWorkspace: onLeaveWorkspace(),
  };
}
