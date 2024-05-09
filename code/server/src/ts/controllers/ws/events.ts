import { SocketHandler } from '@controllers/ws/types';
import operation from '@controllers/ws/namespaces/document/operation';
import cursor from '@controllers/ws/namespaces/document/cursor';
import title from '@controllers/ws/namespaces/document/title';
import join from '@controllers/ws/namespaces/document/join';
import leave from '@controllers/ws/namespaces/document/leave';
import { DocumentService } from '@services/types';

export default function events(service: DocumentService): Record<string, Record<string, SocketHandler>> {
  if (!service) throw new Error('Service parameter is required');

  const documentNamespace = {
    operation: operation(service),
    cursor: cursor(),
    title: title(service),
    join: join(),
    leave: leave(),
  };

  const workspaceNamespace = {};
  const userNamespace = {};

  return {
    '/document': documentNamespace,
    '/workspace': workspaceNamespace,
    '/user': userNamespace,
  };
}
