import { useMemo } from 'react';
import { WorkspaceTree } from '@domain/workspace/tree/WorkspaceTree.ts';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace.ts';

export function useWorkspaceTree(meta : WorkspaceMetaData) {
  return useMemo(() => new WorkspaceTree(meta), [meta]);
}