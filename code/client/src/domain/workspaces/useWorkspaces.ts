import { useEffect, useState } from 'react';
import { WorkspaceInputModel, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { useCommunication } from '@/contexts/communication/useCommunication';
import useWorkspaceService from '@services/workspace/useWorkspaceService';

function useWorkspaces() {
  const { socket } = useCommunication();
  const service = useWorkspaceService();
  const [workspaces, setWorkspaces] = useState<WorkspaceMeta[]>([]);

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

  async function getWorkspaceMembers(id: string) {
    const workspace = await service.getWorkspace(id);
    return workspace.members;
  }

  async function addWorkspaceMember(id: string, email: string) {
    return await service.addWorkspaceMember(id, email);
  }

  async function removeWorkspaceMember(id: string, email: string) {
    return await service.removeWorkspaceMember(id, email);
  }

  useSocketListeners(socket, {
    createdWorkspace: onCreateWorkspace,
    deletedWorkspace: onDeleteWorkspace,
    updatedWorkspace: onUpdateWorkspace,
  });

  useEffect(() => {
    async function fetchWorkspaces() {
      const workspaces = await service.getUserWorkspaces();
      setWorkspaces(workspaces);
    }
    fetchWorkspaces();
  }, [service]);

  return {
    workspaces,
    operations: {
      createWorkspace,
      deleteWorkspace,
      updateWorkspace,
      getWorkspaceMembers,
      addWorkspaceMember,
      removeWorkspaceMember,
    },
  };
}

export default useWorkspaces;
