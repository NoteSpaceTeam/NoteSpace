import { Socket } from 'socket.io';
import Room from '@controllers/ws/rooms/Room';
import { getRoom, joinRoom, leaveRoom } from '@controllers/ws/rooms/operations';
import { ForbiddenError } from '@domain/errors/errors';

/**
 * A map of rooms, where the key is an id and the value is the room.
 */
type Rooms = Map<string, Room>;

const workspaceRooms: Rooms = new Map();
const documentRooms: Rooms = new Map();

function joinDocument(socket: Socket, documentId: string) {
  joinRoom(documentRooms, socket, documentId);
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

function joinWorkspace(socket: Socket, workspaceId: string) {
  joinRoom(workspaceRooms, socket, workspaceId);
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

export default {
  document: {
    join: joinDocument,
    leave: leaveDocument,
    get: getDocument,
    getRoom: getDocumentRoom,
  },
  workspace: {
    join: joinWorkspace,
    leave: leaveWorkspace,
    get: getWorkspace,
    getRoom: getWorkspaceRoom,
  },
};
