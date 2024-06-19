import { Resource } from "./resource";
import { UserData } from "../../users/types";

export type WorkspaceMeta = {
  name: string;
  id: string;
  createdAt: string;
  members: UserData[];
  isPrivate: boolean;
};

export type Workspace = WorkspaceMeta & {
  resources: Resource[];
};

export interface WorkspaceInputModel {
  name: string;
  isPrivate: boolean;
}
