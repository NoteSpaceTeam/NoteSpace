import { Communication } from '@services/communication/communication';
import { useContext } from 'react';
import { CommunicationContext } from '@ui/contexts/communication/CommunicationContext.tsx';

export function useCommunication(): Communication {
  return useContext(CommunicationContext);
}
