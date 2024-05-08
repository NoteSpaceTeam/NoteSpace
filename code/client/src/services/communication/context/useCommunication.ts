import { Communication } from '@/services/communication/communication.ts';
import { useContext } from 'react';
import { CommunicationContext } from '@/services/communication/context/CommunicationContext.tsx';

export function useCommunication(): Communication {
  return useContext(CommunicationContext);
}
