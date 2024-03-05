import { useEffect, useMemo } from 'react';
import { getSocket } from './config.ts';

function useSocketListeners(eventHandlers: Record<string, (...args: any[]) => void>) {
  const socket = useMemo(() => getSocket(), []);
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

  return socket;
}

export default useSocketListeners;
