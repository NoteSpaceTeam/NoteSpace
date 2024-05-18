import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { TreeNode, WorkspaceTreeNode } from '@domain/workspaces/tree/types';

export function getTree(nodes: Map<string, WorkspaceTreeNode>, id: string = 'root'): TreeNode {
  const root = nodes.get(id)!;
  return {
    node: root,
    children: root.children.map(id => getTree(nodes, id)),
  };
}

export function rootNode(children?: string[]): WorkspaceTreeNode {
  return {
    id: 'root',
    name: 'root',
    parent: '',
    children: children || [],
    type: ResourceType.FOLDER,
  };
}
