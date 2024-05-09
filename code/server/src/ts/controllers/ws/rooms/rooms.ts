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

function getDocumentInfo(socket: Socket) {
  const room = getRoom(documentRooms, socket);
  if (!room) throw new InvalidParameterError('User not in document');
  const workspaceInfo = getWorkspaceInfo(socket);
  if (!workspaceInfo) throw new InvalidParameterError('User not in workspace');
  return { id: room.id, workspaceId: workspaceInfo.id };
}

function joinWorkspace(socket: Socket, workspaceId: string) {
  joinRoom(workspaceRooms, socket, workspaceId);
}

function leaveWorkspace(socket: Socket) {
  leaveRoom(workspaceRooms, socket);
}

function getWorkspaceInfo(socket: Socket) {
  const room = getRoom(workspaceRooms, socket);
  if (!room) throw new InvalidParameterError('User not in workspace');
  return { id: room.id };
}

export default {
  document: {
    join: joinDocument,
    leave: leaveDocument,
    get: getDocumentInfo,
  },
  workspace: {
    join: joinWorkspace,
    leave: leaveWorkspace,
    get: getWorkspaceInfo,
  },
};
