import { TreeNode } from '@domain/workspaces/tree/types';
import { Resources } from '@ui/contexts/workspace/WorkspaceContext';

export function getTree(id: string, nodes: Resources): TreeNode {
  const node = nodes[id];
  return {
    node,
    children: node.children.map(id => getTree(id, nodes)),
  };
}
