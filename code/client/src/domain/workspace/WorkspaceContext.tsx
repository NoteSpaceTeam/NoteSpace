import * as React from 'react';
import { useState, createContext, useEffect } from 'react';
import { Workspace } from '@notespace/shared/src/workspace/types/workspace.ts';
import { useCommunication } from '@/services/communication/context/useCommunication.ts';
import useError from '@domain/error/useError.ts';
import { useParams } from 'react-router-dom';
import useWorkspaceService from '@/services/workspace/useWorkspaceService.ts';

export type WorkspaceContextType = {
  workspace?: Workspace;
};

export const WorkspaceContext = createContext<WorkspaceContextType>({
  workspace: undefined,
});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace | undefined>(undefined);
  const { socket } = useCommunication();
  const { publishError } = useError();
  const { wid } = useParams();
  const services = useWorkspaceService();

  useEffect(() => {
    if (!wid) return;
    async function getResources() {
      const workspace = await services.getWorkspace(wid!);
      setWorkspace(workspace);
    }
    socket.emit('joinWorkspace', wid);
    getResources().catch(publishError);
    return () => {
      socket.emit('leaveWorkspace');
    };
  }, [wid, socket, publishError, services]);

  return <WorkspaceContext.Provider value={{ workspace }}>{children}</WorkspaceContext.Provider>;
}
