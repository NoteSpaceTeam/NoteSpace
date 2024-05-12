import { HttpCommunication } from '@/services/communication/http/httpCommunication';
import { DocumentResource, ResourceInputModel, ResourceType } from '@notespace/shared/src/workspace/types/resource.ts';

function documentServices(http: HttpCommunication, wid: string) {
  async function getDocument(id: string): Promise<DocumentResource> {
    return await http.get(`/workspaces/${wid}/${id}`);
  }

  async function createDocument(name: string): Promise<string> {
    const resource: ResourceInputModel = { name, type: ResourceType.DOCUMENT };
    const { id } = await http.post(`/workspaces/${wid}`, resource);
    return id;
  }

  async function deleteDocument(id: string) {
    await http.delete(`/workspace/${wid}/${id}`);
  }

  async function updateDocument(id: string, name: string) {
    const resource: Partial<ResourceInputModel> = { name };
    await http.put(`/workspaces/${wid}/${id}`, resource);
  }

  return {
    getDocument,
    createDocument,
    deleteDocument,
    updateDocument,
  };
}

export default documentServices;
