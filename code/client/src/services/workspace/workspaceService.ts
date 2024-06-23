import { HttpCommunication } from '@services/communication/http/httpCommunication';
import { WorkspaceInputModel, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { Workspace } from '@notespace/shared/src/workspace/types/workspace';
import { validateEmail } from '@services/workspace/utils';

function workspaceService(http: HttpCommunication) {
  async function getWorkspace(id: string): Promise<Workspace> {
    return await http.get(`/workspaces/${id}`);
  }

  async function getWorkspaces(): Promise<WorkspaceMeta[]> {
    return await http.get('/workspaces');
  }

  async function createWorkspace(workspace: WorkspaceInputModel): Promise<string> {
    return await http.post('/workspaces', workspace);
  }

  async function deleteWorkspace(id: string): Promise<void> {
    await http.delete(`/workspaces/${id}`);
  }

  async function updateWorkspace(id: string, newProps: Partial<WorkspaceMeta>): Promise<void> {
    await http.put(`/workspaces/${id}`, newProps);
  }

  async function addWorkspaceMember(id: string, email: string): Promise<void> {
    validateEmail(email);
    await http.post(`/workspaces/${id}/members`, { email });
  }

  async function removeWorkspaceMember(id: string, email: string): Promise<void> {
    validateEmail(email);
    await http.delete(`/workspaces/${id}/members`, { email });
  }

  async function getWorkspacesFeed() {
    return await http.get('/workspaces/search');
  }

  async function searchWorkspaces(query: string, skip: number, limit: number): Promise<WorkspaceMeta[]> {
    return await http.get(`/workspaces/search?query=${query}&skip=${skip}&limit=${limit}`);
  }

  return {
    getWorkspace,
    getWorkspaces,
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
    addWorkspaceMember,
    removeWorkspaceMember,
    getWorkspacesFeed,
    searchWorkspaces,
  };
}

export default workspaceService;
