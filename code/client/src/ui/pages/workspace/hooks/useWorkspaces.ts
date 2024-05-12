import { useEffect, useState } from 'react';
import { WorkspaceInputModel, WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace.ts';
import useSocketListeners from '@/services/communication/socket/useSocketListeners.ts';
import { useCommunication } from '@/services/communication/context/useCommunication.ts';
import useWorkspaceService from '@/services/workspace/useWorkspaceService.ts';

function useWorkspaces() {
  const { socket } = useCommunication();
  const service = useWorkspaceService();
  const [workspaces, setWorkspaces] = useState<WorkspaceMetaData[]>([]);

  function onCreateWorkspace(workspace: WorkspaceMetaData) {
    setWorkspaces([...workspaces, workspace]);
  }

  async function createWorkspace(values: { [key: string]: string }) {
    if (!values.name) throw new Error('Workspace name is required');
    // ... TODO: validate other fields
    const { name, description, visibility, tags, members } = values;
    const workspace: WorkspaceInputModel = { name, description, visibility, tags: [tags], members: [members] }; // TODO: fix later
    await service.createWorkspace(workspace);
  }

  function onDeleteWorkspace(id: string) {
    setWorkspaces(workspaces.filter(workspace => workspace.id !== id));
  }

  async function deleteWorkspace(id: string) {
    await service.deleteWorkspace(id);
  }

  function onUpdateWorkspace(workspace: WorkspaceMetaData) {
    setWorkspaces(workspaces.map(w => (w.id === workspace.id ? workspace : w)));
  }

  async function updateWorkspace(workspace: WorkspaceMetaData) {
    await service.updateWorkspace(workspace.id, workspace);
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
