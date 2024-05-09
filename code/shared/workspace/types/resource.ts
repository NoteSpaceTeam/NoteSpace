// Type definitions for the workspace resource and its subtypes
export interface WorkspaceResource {
  id: string,
  workspace : string,
  name : string,
  type : ResourceType,
  parent : string,
  children : string[]
}

export interface ResourceInputModel {
  workspace : string,
  name : string,
  type : ResourceType,
  parent : string,
}

enum ResourceType { DOCUMENT = "D", FOLDER = "F" }

export interface FolderResource extends WorkspaceResource { type: ResourceType.FOLDER }

interface DocumentResource extends WorkspaceResource { type: ResourceType.DOCUMENT }

export const WorkspaceResource = (resource : ResourceInputModel) =>
  resource.type === ResourceType.DOCUMENT ? doc(resource) : folder(resource)

const doc = (resource: ResourceInputModel) : DocumentResource => ({
  id: '',
  ...resource,
  type: ResourceType.DOCUMENT,
  children: [],
})

const folder = (resource : ResourceInputModel) : FolderResource => ({
  id: '',
  ...resource,
  type: ResourceType.FOLDER,
  children: []
})