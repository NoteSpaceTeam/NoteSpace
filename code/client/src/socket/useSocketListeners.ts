import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

function useSocketListeners(socket : Socket, eventHandlers: Record<string, (...args: any[]) => void>) {
  useEffect(() => {
    const setupEventListeners = () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket.on(event, handler);
      });
    };

    const cleanupEventListeners = () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };

    setupEventListeners();
    return cleanupEventListeners;
  }, [eventHandlers, socket]);
}

export default useSocketListeners;
