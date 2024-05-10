import PromiseRouter from 'express-promise-router';

import { httpResponse } from '@controllers/http/httpResponse';
import { Request, Response } from 'express';
import resourcesHandlers from '@controllers/http/workspace/resourcesHandlers';
import { WorkspaceInfo } from '@notespace/shared/workspace/types/workspace';
import { NoteSpaceServices } from '@services/noteSpaceServices';

function workspaceHandlers(service : NoteSpaceServices){
  const router = PromiseRouter();

  const createWorkspace = async (req : Request, res : Response) => {
    const { name } = req.body as WorkspaceInfo;
    const id = await service.workspace.createWorkspace(name);
    httpResponse.created(res).json({ id });
  }

  const getWorkspaceInfo = async (req : Request, res : Response) => {
    const workspace = await service.workspace.getWorkspace(req.params.wid);
    httpResponse.ok(res).json(workspace);
  }

  const updateWorkspace = async (req : Request, res : Response) => {
    const { id, name } = req.body as WorkspaceInfo;
    await service.workspace.updateWorkspace(id, name);
    httpResponse.noContent(res);
  }

  const deleteWorkspace = async (req : Request, res : Response) => {
    await service.workspace.deleteWorkspace(req.params.wid);
    httpResponse.noContent(res);
  }

  router.post('/', createWorkspace);
  router.put('/', updateWorkspace);
  router.get('/:wid', getWorkspaceInfo);
  router.delete('/:wid', deleteWorkspace);

  // Set sub-routes for resources and documents
  router.use('/:wid/', resourcesHandlers(service.resources));
  return router;
}

export default workspaceHandlers;