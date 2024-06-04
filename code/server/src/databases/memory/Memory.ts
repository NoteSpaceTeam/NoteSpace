import { Resource } from '@notespace/shared/src/workspace/types/resource';

export interface WorkspaceStorage {
  id: string;
  name: string;
  isPrivate: boolean;
  resources: Record<string, Resource>;
  createdAt: string;
  members: string[];
}

export class Memory {
  static workspaces: Record<string, WorkspaceStorage> = {};

  static reset() {
    for (const id of Object.keys(this.workspaces)) {
      delete this.workspaces[id];
    }
  }
}
