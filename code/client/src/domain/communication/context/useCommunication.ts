import { Communication } from '@domain/communication/communication';
import { useContext } from 'react';
import { CommunicationContext } from '@domain/communication/context/CommunicationContext';

export function useCommunication(): Communication {
  return useContext(CommunicationContext);
}
