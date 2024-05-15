import { useEffect } from 'react';
import { SocketCommunication, SocketEventHandlers } from '@services/communication/socket/socketCommunication.ts';

function useSocketListeners(socket: SocketCommunication, eventHandlers: SocketEventHandlers) {
  useEffect(() => {
    socket.on(eventHandlers);
    return () => socket.off(eventHandlers);
  }, [eventHandlers, socket]);
}

export default useSocketListeners;
