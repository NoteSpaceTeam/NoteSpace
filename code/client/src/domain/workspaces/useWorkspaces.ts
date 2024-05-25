import { useEffect, useState } from 'react';
import { WorkspaceInputModel, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import useWorkspaceService from '@services/workspace/useWorkspaceService';
import useError from '@ui/contexts/error/useError';

function useWorkspaces() {
  const { socket } = useCommunication();
  const service = useWorkspaceService();
  const [workspaces, setWorkspaces] = useState<WorkspaceMeta[]>([]);
  const { publishError } = useError();

  function onCreateWorkspace(workspace: WorkspaceMeta) {
    setWorkspaces([...workspaces, workspace]);
  }

  function onDeleteWorkspace(id: string) {
    setWorkspaces(workspaces.filter(workspace => workspace.id !== id));
  }

  function onUpdateWorkspace(newProps: Partial<WorkspaceMeta>) {
    setWorkspaces(
      workspaces.map(workspace => {
        if (workspace.id === newProps.id) {
          return { ...workspace, ...newProps };
        }
        return workspace;
      })
    );
  }

  async function createWorkspace(workspace: WorkspaceInputModel) {
    return await service.createWorkspace(workspace);
  }

  async function deleteWorkspace(id: string) {
    return await service.deleteWorkspace(id);
  }

  async function updateWorkspace(id: string, newProps: Partial<WorkspaceMeta>) {
    return await service.updateWorkspace(id, newProps);
  }

  useSocketListeners(socket, {
    createdWorkspace: onCreateWorkspace,
    deletedWorkspace: onDeleteWorkspace,
    updatedWorkspace: onUpdateWorkspace,
  });

  useEffect(() => {
    async function fetchWorkspaces() {
      const workspaces = await service.getWorkspaces();
      setWorkspaces(workspaces);
    }
    fetchWorkspaces().catch(publishError);
  }, [service, publishError]);

  return {
    workspaces,
    operations: {
      createWorkspace,
      deleteWorkspace,
      updateWorkspace,
    },
  };
}

export default useWorkspaces;
