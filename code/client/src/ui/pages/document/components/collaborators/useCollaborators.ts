import { useState } from 'react';
import { Collaborator } from '@notespace/shared/src/users/types';
import useSocketListeners from '@services/communication/socket/useSocketListeners';
import { useCommunication } from '@/contexts/communication/useCommunication';

function useCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const { socket } = useCommunication();

  const onCollaboratorsJoined = (users: Collaborator[]) => {
    setCollaborators(prev => [...prev, ...users]);
  };

  const onCollaboratorLeft = (id: string) => {
    setCollaborators(prev => prev.filter(u => u.id !== id));
  };

  useSocketListeners(socket, {
    joinedDocument: onCollaboratorsJoined,
    leftDocument: onCollaboratorLeft,
  });

  return collaborators;
}

export default useCollaborators;
