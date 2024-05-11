// type definitions for the workspace resource and its subtypes
import { Operation } from "../../document/types/operations";

export interface WorkspaceResource {
  id: string;
  workspace: string;
  name: string;
  type: ResourceType;
  parent: string;
  children: string[];
}

export interface ResourceInputModel {
  workspace: string;
  name: string;
  type: ResourceType;
  parent: string;
}

export enum ResourceType {
  DOCUMENT = "D",
  FOLDER = "F",
}

export interface WorkspaceResourceMetadata {
  id: string;
  name: string;
  type: ResourceType;
}

export interface FolderResource extends WorkspaceResource {
  type: ResourceType.FOLDER;
}

export interface DocumentResource extends WorkspaceResource {
  type: ResourceType.DOCUMENT;
  content: Operation[];
}

// const doc = (resource: ResourceInputModel): DocumentResource => ({
//   id: "",
//   ...resource,
//   type: ResourceType.DOCUMENT,
//   children: [],
// });
//
// const folder = (resource: ResourceInputModel): FolderResource => ({
//   id: "",
//   ...resource,
//   type: ResourceType.FOLDER,
//   children: [],
// });

export interface DocumentResourceMetadata extends WorkspaceResourceMetadata {
  type: ResourceType.DOCUMENT;
}

export interface FolderResourceMetadata extends WorkspaceResourceMetadata {
  type: ResourceType.FOLDER;
}

export const WorkspaceResourceFactory = (workspace: string) => ({
  Doc: (id: string, name: string, parent?: string): DocumentResource => ({
    type: ResourceType.DOCUMENT,
    id: id || "",
    workspace,
    name: name || "",
    parent: parent || "",
    children: [],
    content: [],
  }),
  Folder: (id: string, name: string, parent?: string): FolderResource => ({
    type: ResourceType.FOLDER,
    id: id || "",
    workspace,
    name: name || "",
    parent: parent || "",
    children: [],
  }),
});
