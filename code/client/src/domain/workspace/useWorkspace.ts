import { useContext } from 'react';
import { WorkspaceContext } from '@domain/workspace/WorkspaceContext';

function useWorkspace() {
  return useContext(WorkspaceContext);
}

export default useWorkspace;
