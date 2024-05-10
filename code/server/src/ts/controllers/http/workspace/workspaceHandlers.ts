import PromiseRouter from 'express-promise-router';
import resourcesHandlers from '@controllers/http/workspace/resourcesHandlers';
import { httpResponse } from '@controllers/http/httpResponse';
import { Request, Response } from 'express';
import { WorkspaceMetaData } from '@notespace/shared/workspace/workspace';
import { NoteSpaceServices } from '@services/noteSpaceServices';

function workspaceHandlers(services: NoteSpaceServices) {
  const router = PromiseRouter();

  const createWorkspace = async (req: Request, res: Response) => {
    const { name } = req.body as WorkspaceMetaData;
    const id = await services.workspace.createWorkspace(name);
    httpResponse.created(res).json({ id });
  };

  const getWorkspace = async (req: Request, res: Response) => {
    const workspace = await services.workspace.getWorkspace(req.params.wid);
    httpResponse.ok(res).json(workspace);
  };

  const updateWorkspace = async (req: Request, res: Response) => {
    const { id, name } = req.body as WorkspaceMetaData;
    await services.workspace.updateWorkspace(id, name);
    httpResponse.noContent(res);
  };

  const deleteWorkspace = async (req: Request, res: Response) => {
    await services.workspace.deleteWorkspace(req.params.wid);
    httpResponse.noContent(res);
  };

  router.post('/', createWorkspace);
  router.get('/:wid', getWorkspace);
  router.put('/:wid', updateWorkspace);
  router.delete('/:wid', deleteWorkspace);

  // sub-routes for resources (documents and folders)
  router.use('/:wid', resourcesHandlers(services.resources));
  return router;
}

export default workspaceHandlers;
