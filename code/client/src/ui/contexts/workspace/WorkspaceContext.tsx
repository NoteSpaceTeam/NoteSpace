import * as React from 'react';
import { useState, createContext, useEffect } from 'react';
import { Workspace, WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace.ts';
import { useCommunication } from '@ui/contexts/communication/useCommunication.ts';
import useError from '@ui/contexts/error/useError';
import { useParams } from 'react-router-dom';
import useWorkspaceService from '@services/workspace/useWorkspaceService.ts';
import useResources from '@ui/contexts/workspace/useResources';
import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource.ts';

type ResourceOperationsType = {
  createResource: (name: string, type: ResourceType) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  updateResource: (id: string, newProps: Partial<WorkspaceResource>) => Promise<void>;
};

export type WorkspaceContextType = {
  workspace?: WorkspaceMetaData;
  resources?: WorkspaceResource[];
  operations?: ResourceOperationsType;
};

export const WorkspaceContext = createContext<WorkspaceContextType>({});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const services = useWorkspaceService();
  const [workspace, setWorkspace] = useState<WorkspaceMetaData | undefined>(undefined);
  const { resources, setResources, operations } = useResources();
  const { socket } = useCommunication();
  const { publishError } = useError();
  const { wid } = useParams();

  useEffect(() => {
    if (!wid) return;
    async function fetchWorkspace() {
      const { id, name, resources }: Workspace = await services.getWorkspace(wid!);
      setWorkspace({ id, name });
      console.log(resources);
      setResources(resources);
    }
    socket.emit('joinWorkspace', wid);
    fetchWorkspace().catch(publishError);
    return () => {
      socket.emit('leaveWorkspace');
    };
  }, [wid, socket, publishError, services, setResources]);

  return <WorkspaceContext.Provider value={{ workspace, resources, operations }}>{children}</WorkspaceContext.Provider>;
}
