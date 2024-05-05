import * as React from 'react';
import { useState, createContext } from 'react';

export type WorkspaceContextType = {
  filePath: string | undefined;
  setFilePath: (path: string) => void;
};

export const WorkspaceContext = createContext<WorkspaceContextType>({
  filePath: undefined,
  setFilePath: () => {},
});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [filePath, setFilePath] = useState<string | undefined>(undefined);
  return <WorkspaceContext.Provider value={{ filePath, setFilePath }}>{children}</WorkspaceContext.Provider>;
}
