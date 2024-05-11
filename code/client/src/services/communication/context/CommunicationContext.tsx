import { createContext, ReactElement } from 'react';
import { communication, Communication } from '@/services/communication/communication.ts';

export const CommunicationContext = createContext<Communication>(communication);

type CommunicationProviderProps = {
  children: ReactElement;
};

export function CommunicationProvider({ children }: CommunicationProviderProps) {
  return <CommunicationContext.Provider value={communication}>{children}</CommunicationContext.Provider>;
}
