import PromiseRouter from 'express-promise-router';
import resourcesHandlers from '@controllers/http/workspace/resourcesHandlers';
import { httpResponse } from '@controllers/http/httpResponse';
import { Request, Response } from 'express';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import { Services } from '@services/Services';
import { Server } from 'socket.io';
import { InvalidParameterError } from '@domain/errors/errors';
import { isValidUUID } from '@src/utils/validators';

function workspaceHandlers(services: Services, io: Server) {
  /**
   * Create a new workspace
   * @param req
   * @param res
   */
  const createWorkspace = async (req: Request, res: Response) => {
    const { name } = req.body as WorkspaceMetaData;
    if (!name) throw new InvalidParameterError('Workspace name is required');
    const id = await services.workspace.createWorkspace(name);
    httpResponse.created(res).json({ id });
  };

  /**
   * Get all workspaces
   * @param req
   * @param res
   */
  const getWorkspaces = async (req: Request, res: Response) => {
    const workspaces = await services.workspace.getWorkspaces();
    httpResponse.ok(res).json(workspaces);
  };

  /**
   * Get a workspace by its id
   * @param req
   * @param res
   */
  const getWorkspace = async (req: Request, res: Response) => {
    const { wid } = req.params;
    const { metaOnly } = req.query;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!isValidUUID(wid)) throw new InvalidParameterError('Invalid workspace id');
    if (metaOnly && !['true', 'false'].includes(metaOnly as string))
      throw new InvalidParameterError('Invalid metaOnly value');

    const workspace = await services.workspace.getWorkspace(wid, metaOnly === 'true');
    httpResponse.ok(res).json(workspace);
  };

  /**
   * Update a workspace information
   * @param req
   * @param res
   */
  const updateWorkspace = async (req: Request, res: Response) => {
    const { wid } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!isValidUUID(wid)) throw new InvalidParameterError('Invalid workspace id');
    const { name } = req.body as WorkspaceMetaData;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!name) throw new InvalidParameterError('Workspace name is required');

    await services.workspace.updateWorkspace(wid, name);
    io.in(wid).emit('updatedWorkspace', { id: wid, name });
    httpResponse.noContent(res).send();
  };

  /**
   * Delete a workspace
   * @param req
   * @param res
   */
  const deleteWorkspace = async (req: Request, res: Response) => {
    const { wid } = req.params;
    if (!wid) throw new InvalidParameterError('Workspace id is required');
    if (!isValidUUID(wid)) throw new InvalidParameterError('Invalid workspace id');

    await services.workspace.deleteWorkspace(wid);
    io.in(wid).emit('workspaceDeleted', { id: wid });
    httpResponse.noContent(res).send();
  };

  const router = PromiseRouter();
  router.post('/', createWorkspace);
  router.get('/', getWorkspaces);
  router.get('/:wid', getWorkspace);
  router.put('/:wid', updateWorkspace);
  router.delete('/:wid', deleteWorkspace);

  // sub-routes for resources (documents and folders)
  router.use('/:wid', resourcesHandlers(services.resources, io));
  return router;
}

export default workspaceHandlers;
