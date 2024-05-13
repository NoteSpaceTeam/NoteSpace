import { WorkspaceResourceMetadata, } from '@notespace/shared/src/workspace/types/resource.ts';
import useSocketListeners from '@/services/communication/socket/useSocketListeners.ts';
import { ResourceType } from '@notespace/shared/src/workspace/types/resource.ts';
import { useCommunication } from '@/services/communication/context/useCommunication.ts';
import useResourceService from '@/services/resource/useResourceService.ts';
import { WorkspaceTree } from '@domain/workspace/tree/WorkspaceTree.ts';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace.ts';
import useWorkspace from '@domain/workspace/useWorkspace.ts';

export function useWorkspaceTreeOperations() {
  const { workspace } = useWorkspace();
  const tree = new WorkspaceTree(workspace as WorkspaceMetaData);
  const { socket } = useCommunication();
  const services = useResourceService()

  async function createResource(type: ResourceType, title: string = '') {
    const id = await services.createResource(title, type);

    const resourceMeta: WorkspaceResourceMetadata = {
      id,
      name: title,
      type,
      parent: '',
      children:[]
    };
    tree.addNode(resourceMeta);
  }

  async function deleteResource(id: string) {
    await services.deleteResource(id);
    tree.removeNode(id)
  }

  async function updateResource(id: string, props : Partial<WorkspaceResourceMetadata>) {
    await services.updateResource(id, props);
    tree.updateNode(id, props)
  }

  useSocketListeners(socket, {
    resourceCreated: tree.addNode,
    resourceDeleted: tree.removeNode,
    resourceUpdated: tree.updateNode,
  });

  return {
    resources: Array.from(tree.traverse()),
    createResource,
    deleteResource,
    updateResource,
  };
}

export default useWorkspaceTreeOperations;
