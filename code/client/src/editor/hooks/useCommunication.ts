import { Communication } from '@socket/communication';
import { useContext } from 'react';
import { CommunicationContext } from '@editor/contexts/CommunicationContext';

export default function useCommunication(): Communication {
  return useContext(CommunicationContext);
}
