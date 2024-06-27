import { Resource } from "./resource";

export type WorkspaceMeta = {
  name: string;
  id: string;
  createdAt: string;
  members: string[];
  isPrivate: boolean;
};

export type Workspace = Omit<WorkspaceMeta, "members"> & {
  resources: Resource[];
  members: string[];
};

export interface WorkspaceInputModel {
  name: string;
  isPrivate: boolean;
}
