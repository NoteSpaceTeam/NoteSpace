import PromiseRouter from 'express-promise-router';
import { NoteSpaceServices } from '@services/types';
import { httpResponse } from '@controllers/http/utils';
import { Request, Response } from 'express';
import resourcesHandlers from '@controllers/http/workspace/resourcesHandlers';
import documentHandlers from '@controllers/http/workspace/documentHandlers';
import { WorkspaceInfo } from '@notespace/shared/workspace/types/workspace';

function workspaceHandlers(service : NoteSpaceServices){
  const router = PromiseRouter();

  const createWorkspace = async (req : Request, res : Response) => {
    const { name } = req.body as WorkspaceInfo;
    const id = await service.workspace.createWorkspace(name);
    httpResponse.created(res).json({ id });
  }

  const getWorkspaceInfo = async (req : Request, res : Response) => {
    const workspace = await service.workspace.getWorkspace(req.params.id);
    httpResponse.ok(res).json(workspace);
  }

  const updateWorkspace = async (req : Request, res : Response) => {
    const { id, name } = req.body as WorkspaceInfo;
    await service.workspace.updateWorkspace(id, name);
    httpResponse.noContent(res);
  }

  const deleteWorkspace = async (req : Request, res : Response) => {
    await service.workspace.deleteWorkspace(req.params.id);
    httpResponse.noContent(res);
  }

  router.post('/', createWorkspace);
  router.put('/', updateWorkspace);
  router.get('/:id', getWorkspaceInfo);
  router.delete('/:id', deleteWorkspace);

  router.use('/:id/resources', resourcesHandlers(service.resources));
  router.use('/:id/documents', documentHandlers(service.document));

  return router;
}

export default workspaceHandlers;