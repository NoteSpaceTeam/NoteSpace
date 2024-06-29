import { TreeNode } from '@domain/workspaces/tree/types';
import { Resources } from '@/contexts/workspace/WorkspaceContext';

export function traverseWorkspaceTree(id: string, nodes: Resources): TreeNode {
  const node = nodes[id];
  return {
    node,
    children: node.children.map(id => traverseWorkspaceTree(id, nodes)),
  };
}
