import { useState } from 'react';
import { rootNode } from '@domain/workspaces/tree/utils';
import { WorkspaceTreeNode } from '@domain/workspaces/tree/types';

function useWorkspaceTree() {
  const [nodes, setNodes] = useState<Map<string, WorkspaceTreeNode>>(new Map());

  function setTree(nodes: WorkspaceTreeNode[]) {
    const nodesMap = new Map(nodes.map(node => [node.id, node]));
    const root = rootNode(
      Array.from(nodes?.values() || [])
        .filter(node => node.parent === 'root')
        .map(node => node.id)
    );
    nodesMap.set('root', root);
    setNodes(nodesMap);
  }

  function getNode(id: string) {
    return nodes.get(id);
  }

  function addNode(node: WorkspaceTreeNode) {
    const newNodes = new Map(nodes);
    const parentNode = newNodes.get(node.parent);
    if (!parentNode) throw new Error('Invalid parent id: ' + node.parent);
    newNodes.set(node.id, node);
    newNodes.set(node.parent, { ...parentNode, children: [...parentNode.children, node.id] });
    setNodes(newNodes);
  }

  function removeNode(id: string) {
    const node = nodes.get(id);
    if (!node) throw new Error('Invalid id: ' + id);
    const { parent } = node;
    const parentNode = nodes.get(parent);
    if (!parentNode) throw new Error('Invalid parent id: ' + parent);
    const newNodes = new Map(nodes);
    const index = parentNode.children.indexOf(id);
    if (index !== -1) parentNode.children.splice(index, 1);
    newNodes.delete(id);
    newNodes.set(parent, parentNode);
    setNodes(newNodes);
  }

  function updateNode(id: string, name: string) {
    const node = nodes.get(id);
    if (!node) throw new Error('Invalid id: ' + id);
    const newNode = { ...node, name };
    nodes.set(id, newNode);
    setNodes(new Map(nodes));
  }

  function moveNode(id: string, newParent: string) {
    const node = nodes.get(id);
    if (!node) throw new Error('Invalid id: ' + id);
    const { parent } = node;
    const parentNode = nodes.get(parent);

    if (parentNode) {
      const index = parentNode.children.indexOf(node.id);
      if (index !== -1) parentNode.children.splice(index, 1);
      nodes.set(parent, parentNode);
    }
    const newParentNode = nodes.get(newParent);
    if (!newParentNode) throw new Error('Invalid parent id: ' + newParent);
    newParentNode.children.push(node.id);
    node.parent = newParent;
    nodes.set(id, node);
    nodes.set(newParent, newParentNode);
    setNodes(new Map(nodes));
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
