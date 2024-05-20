import { WorkspaceResource, WorkspaceResourceMetadata } from "./resource";

export type WorkspaceMetaData = {
  name: string;
  id: string;
};

export type Workspace = WorkspaceMetaData & {
  resources: WorkspaceResource[];
};

export interface WorkspaceInputModel {
  name: string;
  // description: string;
  // visibility: string;
  // tags: string[];
  // members: string[];
}

export type WorkspaceResources = Map<string, WorkspaceResourceMetadata>;
