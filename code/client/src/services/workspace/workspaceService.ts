import { HttpCommunication } from '@services/communication/http/httpCommunication';
import { WorkspaceInputModel, WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { Workspace } from '@notespace/shared/src/workspace/types/workspace';
import { validateEmail } from '@services/workspace/utils';
import { ErrorHandler } from '@/contexts/error/ErrorContext';

function workspaceService(http: HttpCommunication, errorHandler: ErrorHandler) {
  async function getWorkspace(id: string): Promise<Workspace> {
    return errorHandler(async () => await http.get(`/workspaces/${id}`));
  }

  async function getUserWorkspaces(): Promise<WorkspaceMeta[]> {
    return errorHandler(async () => await http.get('/workspaces'));
  }

  async function createWorkspace(workspace: WorkspaceInputModel): Promise<string> {
    return errorHandler(async () => await http.post('/workspaces', workspace));
  }

  async function deleteWorkspace(id: string): Promise<void> {
    return errorHandler(async () => await http.delete(`/workspaces/${id}`));
  }

  async function updateWorkspace(id: string, newProps: Partial<WorkspaceMeta>): Promise<void> {
    return errorHandler(async () => await http.put(`/workspaces/${id}`, newProps));
  }

  async function addWorkspaceMember(id: string, email: string): Promise<void> {
    return errorHandler(async () => {
      validateEmail(email);
      await http.post(`/workspaces/${id}/members`, { email });
    });
  }

  async function removeWorkspaceMember(id: string, email: string): Promise<void> {
    return errorHandler(async () => {
      validateEmail(email);
      await http.delete(`/workspaces/${id}/members`, { email });
    });
  }

  async function getWorkspaces() {
    return errorHandler(async () => await http.get('/workspaces?publicOnly=true'));
  }

  async function searchWorkspaces(query: string, skip: number, limit: number): Promise<WorkspaceMeta[]> {
    return errorHandler(async () => await http.get(`/workspaces/search?query=${query}&skip=${skip}&limit=${limit}`));
  }

  return {
    getWorkspace,
    getUserWorkspaces,
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
    addWorkspaceMember,
    removeWorkspaceMember,
    getWorkspaces,
    searchWorkspaces,
  };
}

export default workspaceService;
