import { Communication } from '@services/communication/communication.ts';
import { useContext } from 'react';
import { CommunicationContext } from '@ui/contexts/communication/CommunicationContext.tsx';

export function useCommunication(): Communication {
  return useContext(CommunicationContext);
}
