import { useMemo } from 'react';
import { WorkspaceTree } from '@domain/workspaces/tree/WorkspaceTree';

function useWorkspaceTree() {
  return useMemo(() => new WorkspaceTree(), []);
}

export default useWorkspaceTree;
