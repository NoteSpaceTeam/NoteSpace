import { useEffect } from 'react';
import useCommunication from '@editor/hooks/useCommunication';

function useSocketListeners(eventHandlers: Record<string, (...args: any[]) => void>) {
  const { on, off } = useCommunication();

  useEffect(() => {
    on(eventHandlers);
    return () => off(eventHandlers);
  }, [eventHandlers, on, off]);
}

export default useSocketListeners;
