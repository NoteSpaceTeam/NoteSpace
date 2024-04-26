import { useEffect } from 'react';
import { Communication } from '@src/communication/communication.ts';

function useSocketListeners({ socket }: Communication, eventHandlers: Record<string, (...args: any[]) => void>) {
  useEffect(() => {
    socket.on(eventHandlers);
    return () => socket.off(eventHandlers);
  }, [eventHandlers, socket]);
}

export default useSocketListeners;
