import { useState } from 'react';
import { rootNode } from '@domain/workspaces/tree/utils';
import { WorkspaceTreeNode, WorkspaceTreeNodes } from '@domain/workspaces/tree/types';
import { WorkspaceResources } from '@notespace/shared/src/workspace/types/workspace';

function useWorkspaceTree() {
  const [nodes, setNodes] = useState<WorkspaceTreeNodes>({});

  function setTree(nodes: WorkspaceResources) {
    const wid = Object.values(nodes)[0].workspace;
    const newNodes = { ...nodes };
    newNodes[wid] = rootNode(newNodes[wid] ? newNodes[wid].children : []);
    setNodes(newNodes);
  }

  const getNode = (id: string) => nodes[id];

  function addNode(node: WorkspaceTreeNode) {
    const newNodes = { ...nodes };
    const parentNode = newNodes[node.parent];
    if (!parentNode) throw new Error('Invalid parent id: ' + node.parent);
    newNodes[node.id] = node;
    newNodes[node.parent] = { ...parentNode, children: [...parentNode.children, node.id] };
    setNodes(newNodes);
  }

  function removeNode(id: string) {
    const node = nodes[id];

    if (!node) throw new Error('Invalid id: ' + id);
    const { parent } = node;
    const parentNode = nodes[parent];

    if (!parentNode) throw new Error('Invalid parent id: ' + parent);
    const newNodes = { ...nodes };
    const index = parentNode.children.indexOf(id);

    if (index !== -1) parentNode.children.splice(index, 1);

    delete newNodes[id];

    newNodes[parent] = parentNode;
    setNodes(newNodes);
  }

  function updateNode(id: string, name: string) {
    const node = nodes[id];
    if (!node) throw new Error('Invalid id: ' + id);
    nodes[id] = { ...node, name };
    setNodes({ ...nodes });
  }

  function moveNode(id: string, newParent: string) {
    const node = nodes[id];
    if (!node) throw new Error('Invalid id: ' + id);
    const { parent } = node;
    const parentNode = nodes[parent];

    if (parentNode) {
      const index = parentNode.children.indexOf(node.id);
      if (index !== -1) parentNode.children.splice(index, 1);
      nodes[parent] = parentNode;
    }
    const newParentNode = nodes[newParent];
    if (!newParentNode) throw new Error('Invalid parent id: ' + newParent);
    newParentNode.children.push(node.id);
    node.parent = newParent;
    nodes[id] = node;
    nodes[newParent] = newParentNode;
    setNodes({ ...nodes });
  }

  function isDescendant(parentId: string, nodeId: string): boolean {
    let currentNode = getNode(parentId);
    while (currentNode) {
      if (currentNode.id === nodeId) {
        return true;
      }
      currentNode = getNode(currentNode.parent);
    }
    return false;
  }

  return {
    nodes,
    setNodes,
    setTree,
    getNode,
    addNode,
    updateNode,
    removeNode,
    moveNode,
    isDescendant,
  };
}

export default useWorkspaceTree;
