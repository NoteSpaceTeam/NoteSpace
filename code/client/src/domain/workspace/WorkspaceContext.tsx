import * as React from 'react';
import { useState, createContext, useEffect } from 'react';
import { WorkspaceResource } from '@notespace/shared/workspace/types/resource.ts';
import { useCommunication } from '@/services/communication/context/useCommunication.ts';
import useError from '@domain/error/useError.ts';

export type WorkspaceContextType = {
  workspace?: string;
  resources: WorkspaceResource[];
  setResources: (resources: WorkspaceResource[]) => void;
  filePath: string | undefined;
  setFilePath: (path: string) => void;
};

export const WorkspaceContext = createContext<WorkspaceContextType>({
  resources: [],
  setResources: () => {},
  filePath: undefined,
  setFilePath: () => {},
});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<WorkspaceResource[]>([]);
  const [filePath, setFilePath] = useState<string | undefined>(undefined);
  const { http } = useCommunication();
  const { showError } = useError();

  useEffect(() => {
    async function getResources() {
      const res = await http.get('/documents');
      setResources(res);
    }
    getResources().catch(showError);
  }, [http, showError]);
  return (
    <WorkspaceContext.Provider value={{ resources, setResources, filePath, setFilePath }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
