import { useEffect, useState } from 'react';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace.ts';
import useSocketListeners from '@/services/communication/socket/useSocketListeners.ts';
import { useCommunication } from '@/services/communication/context/useCommunication.ts';

function useWorkspaces() {
  const { http, socket } = useCommunication();
  const [workspaces, setWorkspaces] = useState<WorkspaceMetaData[]>([]);

  useEffect(() => {
    async function fetchWorkspaces() {
      const workspaces = await http.get('/workspaces');
      setWorkspaces(workspaces);
    }
    fetchWorkspaces();
  }, [http]);

  function onCreateWorkspace(workspace: WorkspaceMetaData) {
    setWorkspaces(prev => [...prev, workspace]);
  }

  async function createWorkspace(values: { [key: string]: string }) {
    if (!values.name) throw new Error('Workspace name is required');
    // ... validate other fields
    const workspace = await http.post('/workspaces', values);
    onCreateWorkspace(workspace);
  }

  function onDeleteWorkspace(id: string) {
    setWorkspaces(workspaces.filter(workspace => workspace.id !== id));
  }

  async function deleteWorkspace(id: string) {
    await http.delete(`/workspaces/${id}`);
    onDeleteWorkspace(id);
  }

  function onUpdateWorkspace(workspace: WorkspaceMetaData) {
    setWorkspaces(workspaces.map(ws => (ws.id === workspace.id ? workspace : ws)));
  }

  async function updateWorkspace(workspace: WorkspaceMetaData) {
    await http.put(`/workspaces/${workspace.id}`, workspace);
    onUpdateWorkspace(workspace);
  }

  useSocketListeners(socket, {
    workspaceCreated: onCreateWorkspace,
    workspaceDeleted: onDeleteWorkspace,
    workspaceUpdated: onUpdateWorkspace,
  });

  return {
    workspaces,
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
  };
}

export default useWorkspaces;
