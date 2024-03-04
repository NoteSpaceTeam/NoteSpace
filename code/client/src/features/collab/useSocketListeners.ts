import { useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { socketConfig } from './config.ts';

function useSocketListeners(eventHandlers: Record<string, (...args: any[]) => void>) {
  const { url, options } = socketConfig;
  const socket = useMemo(() => io(url, options), [options, url])
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
  
  return socket
}

export default useSocketListeners;
