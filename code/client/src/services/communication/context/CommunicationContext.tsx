import { createContext, ReactElement } from 'react';
import { communication, Communication } from '@/services/communication/communication.ts';

export const CommunicationContext = createContext<Communication>(communication);

type CommunicationProviderProps = {
  communication: Communication;
  children: ReactElement;
};

export function CommunicationProvider({ communication, children }: CommunicationProviderProps) {
  return <CommunicationContext.Provider value={communication}>{children}</CommunicationContext.Provider>;
}
