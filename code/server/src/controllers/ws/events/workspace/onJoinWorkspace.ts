import rooms from '@controllers/ws/rooms/rooms';
import { ForbiddenError, InvalidParameterError } from '@domain/errors/errors';
import { WorkspacesService } from '@services/WorkspacesService';
import { Socket } from 'socket.io';
import { getUserFromSocket } from '@controllers/ws/utils';

function onJoinWorkspace(service: WorkspacesService) {
  return async function (socket: Socket, id: string) {
    if (!id) throw new InvalidParameterError('Workspace id is required');

    // ensure user is a member of the workspace
    // this also prevents non-members from applying operations to documents inside the workspace
    const { members } = await service.getWorkspace(id);
    const user = getUserFromSocket(socket);
    if (!user || !members.includes(user.email)) throw new ForbiddenError('Not a member of workspace');

    // join the workspace room
    rooms.workspace.join(socket, id);
  };
}

export default onJoinWorkspace;
