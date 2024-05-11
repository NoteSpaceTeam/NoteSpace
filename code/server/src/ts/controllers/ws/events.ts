import { SocketHandler } from '@controllers/ws/types';
import { DocumentService } from '@services/DocumentService';
import onOperation from '@controllers/ws/namespaces/document/onOperation';
import onCursorChange from '@controllers/ws/namespaces/document/onCursorChange';
import onJoinDocument from '@controllers/ws/namespaces/document/onJoinDocument';
import onLeaveDocument from '@controllers/ws/namespaces/document/onLeaveDocument';
import onJoinWorkspace from '@controllers/ws/namespaces/workspace/onJoinWorkspace';
import onLeaveWorkspace from '@controllers/ws/namespaces/workspace/onLeaveWorkspace';

export default function events(service: DocumentService): Record<string, Record<string, SocketHandler>> {
  if (!service) throw new Error('Service parameter is required');

  return {
    '/document': {
      operation: onOperation(service),
      cursor: onCursorChange(),
      join: onJoinDocument(),
      leave: onLeaveDocument(),
    },
    '/workspaces': {
      join: onJoinWorkspace(),
      leave: onLeaveWorkspace(),
    },
    '/users': {},
  };
}
