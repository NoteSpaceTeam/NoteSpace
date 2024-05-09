// Type definitions for the workspace resource and its subtypes
export interface WorkspaceResource {
  id: string,
  workspace : string,
  name : string,
  type : ResourceType,
  parent : string,
  children : string[]
}

enum ResourceType {
  DOCUMENT = "D",
  FOLDER = "F"
}

export interface FolderResource extends WorkspaceResource {
  type: ResourceType.FOLDER;
}

interface DocumentResource extends WorkspaceResource {
  type: ResourceType.DOCUMENT;
}

export const WorkspaceResourceFactory = (workspace : string) => ({
  Doc: (id : string, name : string, parent ?: string ) : DocumentResource =>  ({
    type: ResourceType.DOCUMENT,
    id: id || '',
    workspace,
    name: name || '',
    parent: parent || '',
    children: [],
  }),
  Folder: (id : string, name : string, parent ?: string ) : FolderResource =>  ({
    type: ResourceType.FOLDER,
    id: id || '',
    workspace,
    name: name || '',
    parent: parent || '',
    children: []
  })
})