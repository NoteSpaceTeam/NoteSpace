import { useEffect } from 'react';
import { SocketCommunication } from '@communication/socket/socket-communication.ts';
import { SocketEventHandlers } from 'socket.io-client';

function useSocketListeners(socket: SocketCommunication, eventHandlers: SocketEventHandlers) {
  useEffect(() => {
    socket.on(eventHandlers);
    return () => socket.off(eventHandlers);
  }, [eventHandlers, socket]);
}

export default useSocketListeners;
