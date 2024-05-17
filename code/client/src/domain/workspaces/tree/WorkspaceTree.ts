import { ResourceType, WorkspaceResourceMetadata } from '@notespace/shared/src/workspace/types/resource';

export type WorkspaceTreeNode = WorkspaceResourceMetadata;

export class WorkspaceTree {
  private root: WorkspaceTreeNode;
  private nodes: Map<string, WorkspaceTreeNode> = new Map();

  constructor() {
    this.root = this.rootNode();
  }

  setNodes(nodes: WorkspaceTreeNode[]) {
    this.nodes = new Map(nodes.map(node => [node.id, node]));
    this.nodes.set('root', this.root);
    this.root = this.rootNode();
  }

  addNode(node: WorkspaceTreeNode) {
    const { parent } = node;
    const parentNode = this.nodes.get(parent);
    if (parentNode) parentNode.children.push(node.id);
    this.nodes.set(node.id, node);
  }

  updateNode(id: string, props: Partial<WorkspaceResourceMetadata>) {
    const node = this.nodes.get(id);
    if (!node) throw new Error('Invalid id: ' + id);
    Object.assign(node, props);
  }

  removeNode(id: string) {
    const node = this.nodes.get(id);
    if (!node) throw new Error('Invalid id: ' + id);
    const { parent } = node;
    const parentNode = this.nodes.get(parent);
    if (parentNode) {
      const index = parentNode.children.indexOf(node.id);
      if (index !== -1) parentNode.children.splice(index, 1);
      this.nodes.delete(node.id);
    }
  }

  moveNode(id: string, newParent: string) {
    const node = this.nodes.get(id);
    if (!node) throw new Error('Invalid id: ' + id);
    const { parent } = node;
    const parentNode = this.nodes.get(parent);

    if (parentNode) {
      const index = parentNode.children.indexOf(node.id);
      if (index !== -1) parentNode.children.splice(index, 1);
    }
    const newParentNode = this.nodes.get(newParent);
    if (!newParentNode) throw new Error('Invalid parent id: ' + newParent);
    newParentNode.children.push(node.id);
    node.parent = newParent;
  }

  *traverse(node = this.root, set = new Set()): IterableIterator<[WorkspaceTreeNode, WorkspaceTreeNode[]]> {
    const children = (node.children?.map(id => this.nodes.get(id)) as WorkspaceTreeNode[]) || [];
    if (node.id !== 'root' && !set.has(node.id)) {
      children.forEach(child => set.add(child.id));
      yield [node, children];
    }
    for (const child of children) {
      yield* this.traverse(child, set);
    }
  }

  clone() {
    const newTree = new WorkspaceTree();
    newTree.root = { ...this.root }; // shallow copy guarantees re-render
    newTree.nodes = this.nodes;
    return newTree;
  }

  get resources() {
    return this.nodes;
  }

  rootNode() {
    const children = Array.from(this.nodes.values())
      .filter(node => node.parent === 'root')
      .map(node => node.id);
    return {
      id: 'root',
      name: 'root',
      parent: '',
      children: children,
      type: ResourceType.FOLDER,
    };
  }
}
