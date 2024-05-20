import { useEffect, useState } from 'react';
import { WorkspaceInputModel, WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import useWorkspaceService from '@services/workspace/useWorkspaceService';
import useError from '@ui/contexts/error/useError';

function useWorkspaces() {
  const { socket } = useCommunication();
  const service = useWorkspaceService();
  const [workspaces, setWorkspaces] = useState<WorkspaceMetaData[]>([]);
  const { publishError } = useError();

  function onCreateWorkspace(workspace: WorkspaceMetaData) {
    setWorkspaces([...workspaces, workspace]);
  }

  function onDeleteWorkspace(id: string) {
    setWorkspaces(workspaces.filter(workspace => workspace.id !== id));
  }

  function onUpdateWorkspace(workspace: WorkspaceMetaData) {
    setWorkspaces(workspaces.map(w => (w.id === workspace.id ? workspace : w)));
  }

  async function createWorkspace(workspace: WorkspaceInputModel) {
    return await service.createWorkspace(workspace);
  }

  async function deleteWorkspace(id: string) {
    return await service.deleteWorkspace(id);
  }

  async function updateWorkspace(id: string, newProps: Partial<WorkspaceMetaData>) {
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
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
  };
}

export default useWorkspaces;