import { HttpCommunication } from '@services/communication/http/httpCommunication';
import { ResourceInputModel, ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';
import { ErrorHandler } from '@/contexts/error/ErrorContext';

function resourcesService(http: HttpCommunication, errorHandler: ErrorHandler, wid: string) {
  async function getResource(id: string): Promise<Resource> {
    return errorHandler(async () => await http.get(`/workspaces/${wid}/${id}`));
  }

  async function createResource(name: string, type: ResourceType, parent?: string): Promise<string> {
    const resource: ResourceInputModel = { name, type, parent: parent || wid };
    return errorHandler(async () => {
      const { id } = await http.post(`/workspaces/${wid}`, resource);
      return id;
    });
  }

  async function deleteResource(id: string): Promise<void> {
    return errorHandler(async () => await http.delete(`/workspaces/${wid}/${id}`));
  }

  async function updateResource(id: string, newProps: Partial<ResourceInputModel>): Promise<void> {
    return errorHandler(async () => await http.put(`/workspaces/${wid}/${id}`, newProps));
  }

  return {
    getResource,
    createResource,
    deleteResource,
    updateResource,
  };
}

export default resourcesService;
