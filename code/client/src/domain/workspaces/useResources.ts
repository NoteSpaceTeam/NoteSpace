import { ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';
import useResourcesService from '@services/resource/useResourcesService';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { useCommunication } from '@/contexts/communication/useCommunication';
import useWorkspaceTree from '@domain/workspaces/tree/useWorkspaceTree';

function useResources() {
  const service = useResourcesService();
  const { socket } = useCommunication();
  const tree = useWorkspaceTree();

  function setResources(resources: Resource[]) {
    tree.setTree(resources);
  }

  function onCreateResource(resource: Resource) {
    tree.addNode(resource);
  }

  async function createResource(name: string, type: ResourceType, parent?: string) {
    await service.createResource(name, type, parent);
  }

  function onDeleteResource(id: string) {
    tree.removeNode(id);
  }

  async function deleteResource(id: string) {
    await service.deleteResource(id);
  }

  function onUpdateResource(resource: Partial<Resource>) {
    if (!resource.id) throw new Error('Resource id is required');
    if (resource.name) tree.updateNode(resource.id, resource.name);
    if (resource.parent) tree.moveNode(resource.id, resource.parent);
  }

  async function updateResource(id: string, newProps: Partial<Resource>) {
    await service.updateResource(id, newProps);
  }

  async function moveResource(id: string, parent: string) {
    if (id === parent || tree.isDescendant(parent, id)) return;
    await service.updateResource(id, { parent });
  }

  useSocketListeners(socket, {
    createdResource: onCreateResource,
    deletedResource: onDeleteResource,
    updatedResource: onUpdateResource,
  });

  return {
    resources: tree.nodes,
    operations: {
      setResources,
      createResource,
      deleteResource,
      updateResource,
      moveResource,
    },
  };
}

export default useResources;
