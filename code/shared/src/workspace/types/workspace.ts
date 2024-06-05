import { Resource } from "./resource";

export type WorkspaceMeta = {
  name: string;
  id: string;
  createdAt: string;
  members: string[];
  isPrivate: boolean;
};

export type Workspace = WorkspaceMeta & {
  resources: Resource[];
};

export interface WorkspaceInputModel {
  name: string;
  isPrivate: boolean;
}
