import { useEffect, useState } from 'react';
import { WorkspaceInputModel, WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace.ts';
import useSocketListeners from '@services/communication/socket/useSocketListeners.ts';
import { useCommunication } from '@ui/contexts/communication/useCommunication.ts';
import useWorkspaceService from '@services/workspace/useWorkspaceService.ts';

function useWorkspaces() {
  const { socket } = useCommunication();
  const service = useWorkspaceService();
  const [workspaces, setWorkspaces] = useState<WorkspaceMetaData[]>([]);

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
    fetchWorkspaces();
  }, [service]);

  return {
    workspaces,
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
  };
}

export default useWorkspaces;
