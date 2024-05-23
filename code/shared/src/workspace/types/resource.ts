import { Operation } from "../../document/types/operations";

export interface Resource {
  id: string;
  workspace: string;
  name: string;
  type: ResourceType;
  parent: string;
  children: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourceInputModel {
  name: string;
  type: ResourceType;
  parent?: string;
}

export enum ResourceType {
  DOCUMENT = "D",
  FOLDER = "F",
}

export interface DocumentResource extends Resource {
  type: ResourceType.DOCUMENT;
  content: Operation[];
}
