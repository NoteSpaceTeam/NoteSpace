import { HttpCommunication } from '@/services/communication/http/httpCommunication.ts';
import {
  ResourceInputModel,
  ResourceType,
  WorkspaceResource,
} from '@notespace/shared/src/workspace/types/resource.ts';

function resourceService(http: HttpCommunication, wid: string) {
  async function getResource(id: string): Promise<WorkspaceResource> {
    return await http.get(`/workspaces/${wid}/${id}`);
  }

  async function createResource(name: string, type: ResourceType): Promise<string> {
    const resource: ResourceInputModel = { name, type };
    const { id } = await http.post(`/workspaces/${wid}`, resource);
    return id;
  }

  async function deleteResource(id: string): Promise<void> {
    await http.delete(`/workspaces/${wid}/${id}`);
  }

  async function updateResource(id: string, newProps: Partial<ResourceInputModel>): Promise<void> {
    await http.put(`/workspaces/${wid}/${id}`, newProps);
  }

  return {
    getResource,
    createResource,
    deleteResource,
    updateResource,
  };
}

export default resourceService;
