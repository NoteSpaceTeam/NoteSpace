import { Communication } from '@services/communication/communication';
import { useContext } from 'react';
import { CommunicationContext } from '@ui/contexts/communication/CommunicationContext';

export function useCommunication(): Communication {
  return useContext(CommunicationContext);
}
