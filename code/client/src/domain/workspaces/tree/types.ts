import { WorkspaceResourceMetadata } from '@notespace/shared/src/workspace/types/resource';

export type TreeNode = {
  node: WorkspaceTreeNode;
  children: TreeNode[];
};

export type WorkspaceTreeNode = WorkspaceResourceMetadata;

export type WorkspaceTreeNodes = Map<string, WorkspaceTreeNode>;
