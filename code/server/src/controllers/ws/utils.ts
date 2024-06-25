import { LoggedUser } from '@notespace/shared/src/users/types';
import { Socket } from 'socket.io';

export function getUserFromSocket(socket: Socket) {
  return (socket.request as any).user as LoggedUser | undefined;
}
