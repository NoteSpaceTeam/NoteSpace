import PromiseRouter from 'express-promise-router';
import resourcesHandlers from '@controllers/http/workspace/resourcesHandlers';
import { httpResponse } from '@controllers/http/httpResponse';
import { Request, Response } from 'express';
import { WorkspaceMetaData } from '@notespace/shared/workspace/types/workspace';
import { Services } from '@services/Services';

function workspaceHandlers(services: Services) {
  /**
   * Create a new workspace
   * @param req
   * @param res
   */
  const createWorkspace = async (req: Request, res: Response) => {
    const { name } = req.body as WorkspaceMetaData;
    const id = await services.workspace.createWorkspace(name);
    httpResponse.created(res).json({ id });
  };

  /**
   * Get a workspace by its id
   * @param req
   * @param res
   */
  const getWorkspace = async (req: Request, res: Response) => {
    const workspace = await services.workspace.getWorkspace(req.params.wid);
    httpResponse.ok(res).json(workspace);
  };

  /**
   * Update a workspace information
   * @param req
   * @param res
   */
  const updateWorkspace = async (req: Request, res: Response) => {
    const { id, name } = req.body as WorkspaceMetaData;
    await services.workspace.updateWorkspace(id, name);
    httpResponse.noContent(res).send();
  };

  /**
   * Delete a workspace
   * @param req
   * @param res
   */
  const deleteWorkspace = async (req: Request, res: Response) => {
    await services.workspace.deleteWorkspace(req.params.wid);
    httpResponse.noContent(res).send();
  };

  const router = PromiseRouter();
  router.post('/', createWorkspace);
  router.get('/:wid', getWorkspace);
  router.put('/:wid', updateWorkspace);
  router.delete('/:wid', deleteWorkspace);

  // sub-routes for resources (documents and folders)
  router.use('/:wid', resourcesHandlers(services.resources));
  return router;
}

export default workspaceHandlers;
