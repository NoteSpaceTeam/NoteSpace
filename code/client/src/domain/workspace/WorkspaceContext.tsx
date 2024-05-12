import * as React from 'react';
import { useState, createContext, useEffect } from 'react';
import { Workspace } from '@notespace/shared/src/workspace/types/workspace.ts';
import { useCommunication } from '@/services/communication/context/useCommunication.ts';
import useError from '@domain/error/useError.ts';
import { useParams } from 'react-router-dom';

export type WorkspaceContextType = {
  workspace?: Workspace;
  filePath?: string;
  setFilePath: (path: string) => void;
};

export const WorkspaceContext = createContext<WorkspaceContextType>({
  workspace: undefined,
  filePath: undefined,
  setFilePath: () => {},
});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace | undefined>(undefined);
  const [filePath, setFilePath] = useState<string | undefined>(undefined);
  const { http } = useCommunication();
  const { publishError } = useError();
  const { wid } = useParams();

  useEffect(() => {
    if (!wid) return;
    async function getResources() {
      const ws = await http.get(`/workspaces/${wid}`);
      setWorkspace(ws);
    }
    getResources().catch(publishError);
  }, [http, publishError, wid]);

  return <WorkspaceContext.Provider value={{ workspace, filePath, setFilePath }}>{children}</WorkspaceContext.Provider>;
}
