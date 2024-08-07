import rooms from '@controllers/ws/rooms/rooms';
import { InvalidParameterError } from '@src/errors';
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
    if (!user || !members.includes(user.email)) return;

    // join the workspace room
    rooms.workspaces.join(socket, id, user);
  };
}

export default onJoinWorkspace;
