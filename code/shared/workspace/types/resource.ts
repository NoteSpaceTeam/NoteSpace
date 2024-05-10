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

export enum ResourceType { DOCUMENT = "D", FOLDER = "F" }

export const WorkspaceResource = (resource : ResourceInputModel) =>
  resource.type === ResourceType.DOCUMENT ? doc(resource) : folder(resource)

const doc = (resource: ResourceInputModel) : WorkspaceResource => ({
  id: '',
  ...resource,
  type: ResourceType.DOCUMENT,
  children: [],
})

const folder = (resource : ResourceInputModel) : WorkspaceResource => ({
  id: '',
  ...resource,
  type: ResourceType.FOLDER,
  children: []
})