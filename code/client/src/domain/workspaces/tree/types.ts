import { Resource } from '@notespace/shared/src/workspace/types/resource';

export type TreeNode = {
  node: Resource;
  children: TreeNode[];
};
