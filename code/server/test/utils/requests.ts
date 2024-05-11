import { Express } from 'express';
import { documentRequests } from './documentRequests';
import { workspaceRequests } from './workspaceRequests';

export function requests(app: Express) {
  return {
    document: documentRequests(app),
    workspace: workspaceRequests(app),
  };
}
