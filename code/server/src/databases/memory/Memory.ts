import { Resource } from '@notespace/shared/src/workspace/types/resource';
import { User } from '@notespace/shared/src/users/types';

export interface WorkspaceStorage {
  id: string;
  name: string;
  isPrivate: boolean;
  resources: Record<string, Resource>;
  createdAt: string;
  members: string[];
}

export class Memory {
  static users: Record<string, User> = {};
  static workspaces: Record<string, WorkspaceStorage> = {};

  static reset() {
    for (const id of Object.keys(this.workspaces)) {
      delete this.workspaces[id];
    }
  }
}
