import { WorkspaceResource } from "./resource";

export type WorkspaceMetaData = {
  name: string;
  id: string;
};

export type Workspace = WorkspaceMetaData & {
  resources: WorkspaceResource[];
};
