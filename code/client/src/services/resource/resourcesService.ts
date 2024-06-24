import { HttpCommunication } from '@services/communication/http/httpCommunication';
import { ResourceInputModel, ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';

function resourcesService(http: HttpCommunication, publishError: (error: Error) => void, wid: string) {
  async function getResource(id: string): Promise<Resource> {
    return http.get(`/workspaces/${wid}/${id}`).catch(publishError);
  }

  async function createResource(name: string, type: ResourceType, parent?: string): Promise<string> {
    const resource: ResourceInputModel = { name, type, parent: parent || wid };
    return http
      .post(`/workspaces/${wid}`, resource)
      .then(resource => resource.id)
      .catch(publishError);
  }

  async function deleteResource(id: string): Promise<void> {
    http.delete(`/workspaces/${wid}/${id}`).catch(publishError);
  }

  async function updateResource(id: string, newProps: Partial<ResourceInputModel>): Promise<void> {
    http.put(`/workspaces/${wid}/${id}`, newProps).catch(publishError);
  }

  return {
    getResource,
    createResource,
    deleteResource,
    updateResource,
  };
}

export default resourcesService;
