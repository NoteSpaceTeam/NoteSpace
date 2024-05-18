import {
  ResourceType,
  WorkspaceResource,
  WorkspaceResourceMetadata,
} from '@notespace/shared/src/workspace/types/resource';
import useResourceService from '@services/resource/useResourceService';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import { useState } from 'react';
import useWorkspaceTree from '@domain/workspaces/tree/useWorkspaceTree';

function useResources() {
  const service = useResourceService();
  const { socket } = useCommunication();
  const [resources, setResources] = useState<WorkspaceResource[]>([]);
  const tree = useWorkspaceTree();

  function onCreateResource(resource: WorkspaceResource) {
    setResources([...resources, resource]);
    tree.addNode(resource);
  }

  async function createResource(name: string, type: ResourceType, parent?: string) {
    await service.createResource(name, type, parent || 'root');
  }

  function onDeleteResource(id: string) {
    setResources(resources.filter(resource => resource.id !== id));
    tree.removeNode(id);
  }

  async function deleteResource(id: string) {
    await service.deleteResource(id);
  }

  function onUpdateResource(resource: Partial<WorkspaceResourceMetadata>) {
    if (!resource.id) throw new Error('Resource id is required');
    setResources(resources.map(res => (res.id === resource.id ? { ...res, ...resource } : res)));
    if (resource.name) tree.updateNode(resource.id, resource.name);
  }

  async function updateResource(id: string, newProps: Partial<WorkspaceResource>) {
    await service.updateResource(id, newProps);
  }

  useSocketListeners(socket, {
    createdResource: onCreateResource,
    deletedResource: onDeleteResource,
    updatedResource: onUpdateResource,
  });

  return {
    resources,
    setResources,
    tree,
    operations: {
      createResource,
      deleteResource,
      updateResource,
    },
  };
}

export default useResources;
