import { Socket } from 'socket.io';
import Room from '@controllers/ws/rooms/Room';
import { getRoom, joinRoom, leaveRoom } from '@controllers/ws/rooms/operations';
import { ForbiddenError } from '@domain/errors/errors';
import { UserData } from '@notespace/shared/src/users/types';

/**
 * A map of rooms, where the key is an id and the value is the room.
 */
type Rooms = Map<string, Room>;

const workspaceRooms: Rooms = new Map();
const documentRooms: Rooms = new Map();

function joinDocument(socket: Socket, documentId: string, user: UserData) {
  joinRoom(documentRooms, documentId, socket, user);
}

function leaveDocument(socket: Socket) {
  leaveRoom(documentRooms, socket);
}

function getDocument(socketId: string) {
  const room = getRoom(documentRooms, socketId);
  if (!room) throw new ForbiddenError('Not in a document');
  const workspace = getWorkspace(socketId);
  if (!workspace) throw new ForbiddenError('Not in a workspace');
  return { id: room.id, wid: workspace.id };
}

function getDocumentRoom(id: string) {
  return documentRooms.get(id);
}

function isInDocumentRoom(socketId: string) {
  return !!getRoom(documentRooms, socketId);
}

function joinWorkspace(socket: Socket, workspaceId: string, user: UserData) {
  joinRoom(workspaceRooms, workspaceId, socket, user);
}

function leaveWorkspace(socket: Socket) {
  leaveRoom(workspaceRooms, socket);
}

function getWorkspace(socketId: string) {
  const room = getRoom(workspaceRooms, socketId);
  if (!room) throw new ForbiddenError('Not in a workspace');
  return { id: room.id };
}

function getWorkspaceRoom(id: string) {
  return workspaceRooms.get(id);
}

function isInWorkspaceRoom(socketId: string) {
  return !!getRoom(workspaceRooms, socketId);
}

export default {
  document: {
    join: joinDocument,
    leave: leaveDocument,
    get: getDocument,
    getRoom: getDocumentRoom,
    isInRoom: isInDocumentRoom,
  },
  workspace: {
    join: joinWorkspace,
    leave: leaveWorkspace,
    get: getWorkspace,
    getRoom: getWorkspaceRoom,
    isInRoom: isInWorkspaceRoom,
  },
};
