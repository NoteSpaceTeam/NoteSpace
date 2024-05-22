import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import { TreeNode, WorkspaceTreeNode, WorkspaceTreeNodes } from '@domain/workspaces/tree/types';

export function getTree(nodes: WorkspaceTreeNodes, id: string): TreeNode {
  const root = nodes[id];
  return {
    node: root,
    children: root.children.map(id => getTree(nodes, id)),
  };
}

export function rootNode(wid: string, children?: string[]): WorkspaceTreeNode {
  return {
    id: wid,
    workspace: wid,
    name: 'root',
    parent: '',
    children: children || [],
    type: ResourceType.FOLDER,
  };
}
