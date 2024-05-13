import { WorkspaceMetaData, WorkspaceResources } from '@notespace/shared/src/workspace/types/workspace.ts';
import { ResourceType, WorkspaceResourceMetadata } from '@notespace/shared/src/workspace/types/resource.ts';

export class WorkspaceTree{
  private root: WorkspaceResourceMetadata

  private nodes : WorkspaceResources = new Map()

  constructor(meta : WorkspaceMetaData){
    this.root = {...meta, type: ResourceType.DOCUMENT, parent: '', children: []}
    this.nodes.set(meta.id, this.root);
  }

  setNodes(_nodes: WorkspaceResources, root : WorkspaceResourceMetadata){
    this.nodes = _nodes
    this.root = root
  }

  addNode(node: WorkspaceResourceMetadata){
    const { parent } = node
    const parentNode = this.nodes.get(parent);
    if(parentNode) parentNode.children.push(node.id)
    this.nodes.set(node.id, node)
  }

  updateNode(id: string, props: Partial<WorkspaceResourceMetadata>){
    const node = this.nodes.get(id)
    if(!node) throw new Error("Invalid id:" + id)
    Object.assign(node, props)
  }

  removeNode(id: string){
    const node = this.nodes.get(id)
    if(!node) throw new Error("Invalid id:" + id)
    const { parent } = node;
    const parentNode = this.nodes.get(parent);
    if(parentNode){
      const index = parentNode.children.indexOf(node.id);
      if(index !== -1) parentNode.children.splice(index, 1);
      this.nodes.delete(node.id)
    }
  }

  moveNode(id: string, newParent: string){
    const node = this.nodes.get(id)
    if(!node) throw new Error("Invalid id:" + id)
    const { parent } = node;
    const parentNode = this.nodes.get(parent);

    if(parentNode){
      const index = parentNode.children.indexOf(node.id);
      if(index !== -1) parentNode.children.splice(index, 1);
    }
    const newParentNode = this.nodes.get(newParent);
    if(!newParentNode) throw new Error("Invalid parent id:" + newParent)
    newParentNode.children.push(node.id)

    node.parent = newParent
  }

  *traverse() : IterableIterator<WorkspaceResourceMetadata>{
    const stack: WorkspaceResourceMetadata[] = [];
    stack.push(this.root);

    while (stack.length > 0) {
      const node = stack.pop()!;
      yield node;
      stack.push(...node.children.map(id => this.nodes.get(id)!).reverse());
    }
  }

  get resources() {
    return this.nodes
  }
}