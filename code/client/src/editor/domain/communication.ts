import { socket } from '@socket/socket';

type EmitType = (event: string, data: any) => void;
type ListenType = (eventHandlers: Record<string, (...args: any[]) => void>) => void;

export type Communication = {
  emit: EmitType;
  emitChunked: EmitType;
  on: ListenType;
  off: ListenType;
};

function emit(event: string, data: any) {
  socket.emit(event, data);
}

function emitChunked(event: string, data: any) {
  socket.emitChunked(event, data);
}

function on(eventHandlers: Record<string, (...args: any[]) => void>) {
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    socket.on(event, handler);
  });
}

function off(eventHandlers: Record<string, (...args: any[]) => void>) {
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    socket.off(event, handler);
  });
}

export const communication: Communication = {
  emit,
  emitChunked,
  on,
  off,
};
