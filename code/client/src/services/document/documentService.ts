import { HttpCommunication } from '@/services/communication/http/httpCommunication.ts';
import { DocumentResource, ResourceInputModel, ResourceType } from '@notespace/shared/src/workspace/types/resource.ts';

function documentService(http: HttpCommunication, wid: string) {
  async function getDocument(id: string): Promise<DocumentResource> {
    return await http.get(`/workspaces/${wid}/${id}`);
  }

  async function createDocument(name: string): Promise<string> {
    const resource: ResourceInputModel = { name, type: ResourceType.DOCUMENT };
    const { id } = await http.post(`/workspaces/${wid}`, resource);
    return id;
  }

  async function deleteDocument(id: string): Promise<void> {
    await http.delete(`/workspaces/${wid}/${id}`);
  }

  async function updateDocument(id: string, newProps: Partial<ResourceInputModel>): Promise<void> {
    await http.put(`/workspaces/${wid}/${id}`, newProps);
  }

  return {
    getDocument,
    createDocument,
    deleteDocument,
    updateDocument,
  };
}

export default documentService;