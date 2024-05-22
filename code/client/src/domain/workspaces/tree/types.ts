import { WorkspaceResource } from '@notespace/shared/src/workspace/types/resource';

export type TreeNode = {
  node: WorkspaceTreeNode;
  children: TreeNode[];
};

export type WorkspaceTreeNode = WorkspaceResource;

export type WorkspaceTreeNodes = Record<string, WorkspaceTreeNode>;
