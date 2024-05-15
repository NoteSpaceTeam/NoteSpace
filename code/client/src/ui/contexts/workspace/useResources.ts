import { ResourceType, WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';
import useResourceService from '@services/resource/useResourceService';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import { useState } from 'react';

function useResources() {
  const service = useResourceService();
  const [resources, setResources] = useState<WorkspaceResource[]>([]);
  const { socket } = useCommunication();

  function onCreateResource(resource: WorkspaceResource) {
    setResources([...resources, resource]);
  }

  async function createResource(name: string, type: ResourceType) {
    await service.createResource(name, type);
  }

  function onDeleteResource(id: string) {
    setResources(resources.filter(resource => resource.id !== id));
  }

  async function deleteResource(id: string) {
    await service.deleteResource(id);
  }

  function onUpdateResource(resource: Partial<WorkspaceResource>) {
    setResources(resources.map(res => (res.id === resource.id ? { ...res, ...resource } : res)));
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
    operations: {
      createResource,
      deleteResource,
      updateResource,
    },
  };
}

export default useResources;
