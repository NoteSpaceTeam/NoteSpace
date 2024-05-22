import { Resource } from "./resource";

export type WorkspaceMeta = {
  name: string;
  id: string;
};

export type Workspace = WorkspaceMeta & {
  resources: Resource[];
};

export interface WorkspaceInputModel {
  name: string;
  description?: string;
  visibility?: string;
  tags?: string[];
  members?: string[];
}
