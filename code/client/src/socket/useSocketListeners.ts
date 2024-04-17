import { useEffect } from 'react';
import { Communication } from '@editor/domain/communication';

function useSocketListeners({ on, off }: Communication, eventHandlers: Record<string, (...args: any[]) => void>) {
  useEffect(() => {
    on(eventHandlers);
    return () => off(eventHandlers);
  }, [eventHandlers, on, off]);
}

export default useSocketListeners;
