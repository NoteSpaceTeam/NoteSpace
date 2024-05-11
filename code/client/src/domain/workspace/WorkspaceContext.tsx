import * as React from 'react';
import { useState, createContext, useEffect } from 'react';
import { WorkspaceResource } from '@notespace/shared/src/workspace/types/resource.ts';
import { useCommunication } from '@/services/communication/context/useCommunication.ts';
import useError from '@domain/error/useError.ts';
import { useParams } from 'react-router-dom';

export type WorkspaceContextType = {
  resources: WorkspaceResource[];
  filePath?: string;
  setFilePath: (path: string) => void;
};

export const WorkspaceContext = createContext<WorkspaceContextType>({
  resources: [],
  filePath: undefined,
  setFilePath: () => {},
});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<WorkspaceResource[]>([]);
  const [filePath, setFilePath] = useState<string | undefined>(undefined);
  const { http } = useCommunication();
  const { publishError } = useError();
  const { wid } = useParams();

  useEffect(() => {
    if (!wid) return;
    async function getResources() {
      const res = await http.get(`/workspaces/${wid}`);
      setResources(res);
    }
    getResources().catch(publishError);
  }, [http, publishError, wid]);

  return <WorkspaceContext.Provider value={{ resources, filePath, setFilePath }}>{children}</WorkspaceContext.Provider>;
}
