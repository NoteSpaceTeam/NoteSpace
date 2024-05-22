import * as React from 'react';
import { useState, createContext, useEffect } from 'react';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import useError from '@ui/contexts/error/useError';
import { useParams } from 'react-router-dom';
import useWorkspaceService from '@services/workspace/useWorkspaceService';
import useResources, { UseResourcesType } from '@ui/contexts/workspace/useResources';
import { WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import { WorkspaceTreeNodes } from '@domain/workspaces/tree/types';

export type WorkspaceContextType = {
  workspace?: WorkspaceMetaData;
  resources?: WorkspaceResource[];
  operations?: Omit<UseResourcesType['operations'], 'setResources'>;
  nodes?: WorkspaceTreeNodes;
};

export const WorkspaceContext = createContext<WorkspaceContextType>({});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const services = useWorkspaceService();
  const [workspace, setWorkspace] = useState<WorkspaceMetaData | undefined>(undefined);
  const { resources, tree, operations } = useResources();
  const { socket } = useCommunication();
  const { publishError } = useError();
  const { wid } = useParams();

  useEffect(() => {
    if (!wid) return;

    async function fetchWorkspace() {
      const { id, name, resources } = await services.getWorkspace(wid!);
      console.log('fetchWorkspace', resources);
      setWorkspace({ id, name });
      operations.setResources(resources);
    }
    socket.emit('joinWorkspace', wid);
    fetchWorkspace().catch(publishError);
    return () => {
      socket.emit('leaveWorkspace');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wid, services, socket, publishError]);

  const newOperations: WorkspaceContextType['operations'] = {
    createResource: operations.createResource,
    deleteResource: operations.deleteResource,
    updateResource: operations.updateResource,
    moveResource: operations.moveResource,
  };

  useEffect(() => {
    console.log('resources: ', resources);
  }, [resources]);

  return (
    <WorkspaceContext.Provider
      value={{ workspace, resources: Object.values(resources), operations: newOperations, nodes: tree.nodes }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
