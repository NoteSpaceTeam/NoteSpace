import {
  ResourceType,
  WorkspaceResource,
  WorkspaceResourceMetadata,
} from '@notespace/shared/src/workspace/types/resource';
import useResourceService from '@services/resource/useResourceService';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import { useState } from 'react';
import { WorkspaceTree } from '@domain/workspaces/tree/WorkspaceTree';

function useResources() {
  const service = useResourceService();
  const { socket } = useCommunication();
  const [resources, setResources] = useState<WorkspaceResource[]>([]);
  const [tree, setTree] = useState(new WorkspaceTree());

  function onCreateResource(resource: WorkspaceResource) {
    setResources([...resources, resource]);
    setTree(prev => {
      prev.addNode(resource);
      return prev.clone();
    });
  }

  async function createResource(name: string, type: ResourceType, parent?: string) {
    await service.createResource(name, type, parent || 'root');
  }

  function onDeleteResource(id: string) {
    setResources(resources.filter(resource => resource.id !== id));
    setTree(prev => {
      prev.removeNode(id);
      return prev.clone();
    });
  }

  async function deleteResource(id: string) {
    await service.deleteResource(id);
  }

  function onUpdateResource(id: string, resource: Partial<WorkspaceResourceMetadata>) {
    setResources(resources.map(res => (res.id === resource.id ? { ...res, ...resource } : res)));
    setTree(prev => {
      prev.updateNode(id, resource);
      return prev.clone();
    });
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
    setTree,
    operations: {
      createResource,
      deleteResource,
      updateResource,
    },
  };
}

export default useResources;
