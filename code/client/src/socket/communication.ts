import { socket } from '@socket/socket';

export type EmitType = (event: string, data: any) => void;
export type ListenType = (eventHandlers: Record<string, (...args: any[]) => void>) => void;

export function emit(event: string, data: any) {
  socket.emit(event, data);
}

export function emitChunked(event: string, data: any) {
  socket.emitChunked(event, data);
}

export function on(eventHandlers: Record<string, (...args: any[]) => void>) {
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    socket.on(event, handler);
  });
}

export function off(eventHandlers: Record<string, (...args: any[]) => void>) {
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    socket.off(event, handler);
  });
}

export type Communication = {
  emit: EmitType;
  emitChunked: EmitType;
  on: ListenType;
  off: ListenType;
};
