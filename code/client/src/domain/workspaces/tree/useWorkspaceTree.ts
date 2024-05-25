import { useState } from 'react';
import { Resource } from '@notespace/shared/src/workspace/types/resource';
import { Resources } from '@ui/contexts/workspace/WorkspaceContext';

function useWorkspaceTree() {
  const [nodes, setNodes] = useState<Resources>({});

  function setTree(resources: Resource[]) {
    const nodesRecord = Object.fromEntries(resources.map(node => [node.id, node]));
    setNodes(nodesRecord);
  }

  function addNode(node: Resource) {
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

    const deleteDescendants = (node: Resource) => {
      node.children.forEach(childId => {
        const childNode = newNodes[childId];
        if (childNode) {
          deleteDescendants(childNode);
        }
      });
      delete newNodes[node.id];
    };

    // delete node and its descendants recursively
    deleteDescendants(node);

    // remove the node from its parent's children array
    const index = parentNode.children.indexOf(id);
    if (index !== -1) parentNode.children.splice(index, 1);

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
    let currentNode = nodes[parentId];
    while (currentNode) {
      if (currentNode.id === nodeId) {
        return true;
      }
      currentNode = nodes[currentNode.parent];
    }
    return false;
  }

  return {
    nodes,
    setNodes,
    setTree,
    addNode,
    updateNode,
    removeNode,
    moveNode,
    isDescendant,
  };
}

export default useWorkspaceTree;
