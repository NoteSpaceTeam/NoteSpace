import * as React from 'react';
import { createContext } from 'react';
import { Communication, EmitType, ListenType } from '@socket/communication';

export const CommunicationContext = createContext<Communication>({
  emit: () => {},
  emitChunked: () => {},
  on: () => {},
  off: () => {},
});

type CommunicationProviderProps = {
  emit: EmitType;
  emitChunked: EmitType;
  on: ListenType;
  off: ListenType;
  children: React.ReactNode;
};

export function CommunicationProvider({ emit, emitChunked, on, off, children }: CommunicationProviderProps) {
  return (
    <CommunicationContext.Provider value={{ emit, emitChunked, on, off }}>{children}</CommunicationContext.Provider>
  );
}
