import { HttpCommunication } from '@services/communication/http/httpCommunication.ts';
import { WorkspaceInputModel, WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace.ts';
import { Workspace } from '@notespace/shared/src/workspace/types/workspace.ts';

function workspaceService(http: HttpCommunication) {
  async function getWorkspace(id: string): Promise<Workspace> {
    return await http.get(`/workspaces/${id}`);
  }

  async function getWorkspaces(): Promise<WorkspaceMetaData[]> {
    return await http.get('/workspaces');
  }

  async function createWorkspace(workspace: WorkspaceInputModel): Promise<string> {
    return await http.post('/workspaces', workspace);
  }

  async function deleteWorkspace(id: string): Promise<void> {
    await http.delete(`/workspaces/${id}`);
  }

  async function updateWorkspace(id: string, newProps: Partial<WorkspaceMetaData>): Promise<void> {
    await http.put(`/workspaces/${id}`, newProps);
  }

  return {
    getWorkspace,
    getWorkspaces,
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
  };
}

export default workspaceService;
