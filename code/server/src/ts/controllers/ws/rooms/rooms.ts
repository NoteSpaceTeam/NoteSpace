import { Socket } from 'socket.io';
import Room from '@controllers/ws/rooms/Room';
import { getRoom, joinRoom, leaveRoom } from '@controllers/ws/rooms/roomOperations';
import { InvalidParameterError } from '@domain/errors/errors';

type Rooms = Map<string, Room>;
const workspaceRooms: Rooms = new Map(); // (documentId) => Room
const documentRooms: Rooms = new Map(); // (workspaceId) => Room

function joinDocument(socket: Socket, documentId: string) {
  joinRoom(documentRooms, socket, documentId);
}

function leaveDocument(socket: Socket) {
  leaveRoom(documentRooms, socket);
}

function getDocument(socket: Socket) {
  const room = getRoom(documentRooms, socket);
  if (!room) throw new InvalidParameterError('User not in document');
  const workspaceInfo = getWorkspace(socket);
  if (!workspaceInfo) throw new InvalidParameterError('User not in workspace');
  return { id: room.id, workspaceId: workspaceInfo.id };
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

function getWorkspace(socket: Socket) {
  const room = getRoom(workspaceRooms, socket);
  if (!room) throw new InvalidParameterError('User not in workspace');
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
