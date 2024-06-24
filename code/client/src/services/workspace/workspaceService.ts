import { HttpCommunication } from '@services/communication/http/httpCommunication';
import { WorkspaceInputModel, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { Workspace } from '@notespace/shared/src/workspace/types/workspace';
import { validateEmail } from '@services/workspace/utils';

function workspaceService(http: HttpCommunication, publishError: (error: Error) => void) {
  async function getWorkspace(id: string): Promise<Workspace> {
    return http.get(`/workspaces/${id}`).catch(publishError);
  }

  async function getWorkspaces(): Promise<WorkspaceMeta[]> {
    return http.get('/workspaces').catch(publishError);
  }

  async function createWorkspace(workspace: WorkspaceInputModel): Promise<string> {
    return http.post('/workspaces', workspace).catch(publishError);
  }

  async function deleteWorkspace(id: string): Promise<void> {
    http.delete(`/workspaces/${id}`).catch(publishError);
  }

  async function updateWorkspace(id: string, newProps: Partial<WorkspaceMeta>): Promise<void> {
    http.put(`/workspaces/${id}`, newProps).catch(publishError);
  }

  async function addWorkspaceMember(id: string, email: string): Promise<void> {
    validateEmail(email);
    http.post(`/workspaces/${id}/members`, { email }).catch(publishError);
  }

  async function removeWorkspaceMember(id: string, email: string): Promise<void> {
    validateEmail(email);
    http.delete(`/workspaces/${id}/members`, { email }).catch(publishError);
  }

  async function getWorkspacesFeed() {
    return http.get('/workspaces/search').catch(publishError);
  }

  async function searchWorkspaces(query: string, skip: number, limit: number): Promise<WorkspaceMeta[]> {
    return http.get(`/workspaces/search?query=${query}&skip=${skip}&limit=${limit}`).catch(publishError);
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
