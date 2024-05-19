import * as React from 'react';
import { useState, createContext, useEffect } from 'react';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import useError from '@ui/contexts/error/useError';
import { useParams } from 'react-router-dom';
import useWorkspaceService from '@services/workspace/useWorkspaceService';
import useResources from '@ui/contexts/workspace/useResources';
import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { WorkspaceTreeNodes } from '@domain/workspaces/tree/types';

export type ResourceOperationsType = {
  createResource: (name: string, type: ResourceType, parent?: string) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  updateResource: (id: string, newProps: Partial<WorkspaceResource>) => Promise<void>;
  moveResource: (id: string, parent: string) => Promise<void>;
};

export type WorkspaceContextType = {
  workspace?: WorkspaceMetaData;
  resources?: WorkspaceResource[];
  operations?: ResourceOperationsType;
  nodes?: WorkspaceTreeNodes;
};

export const WorkspaceContext = createContext<WorkspaceContextType>({});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const services = useWorkspaceService();
  const [workspace, setWorkspace] = useState<WorkspaceMetaData | undefined>(undefined);
  const { resources, setResources, tree, operations } = useResources();
  const { socket } = useCommunication();
  const { publishError } = useError();
  const { wid } = useParams();

  useEffect(() => {
    if (!wid) return;

    async function fetchWorkspace() {
      const { id, name, resources } = await services.getWorkspace(wid!);
      setWorkspace({ id, name });
      setResources(resources);
      tree.setTree(resources);
    }
    socket.emit('joinWorkspace', wid);
    fetchWorkspace().catch(publishError);
    return () => {
      socket.emit('leaveWorkspace');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wid, services, socket, publishError]);

  return (
    <WorkspaceContext.Provider value={{ workspace, resources, operations, nodes: tree.nodes }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
